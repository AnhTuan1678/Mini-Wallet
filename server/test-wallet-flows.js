const sails = require('sails');
const bcrypt = require('bcrypt');

sails.lift({
  hooks: { grunt: false },
  log: { level: 'error' }
}, async (err) => {
  if (err) {
    console.error('Failed to lift Sails:', err);
    process.exit(1);
  }

  try {
    console.log('=== KẾT QUẢ KHỞI CHẠY THỬ NGHIỆM HỆ THỐNG GIAO DỊCH ===\n');

    const { generateChecksum } = require('./api/services/PocketService');

    // 1. Lấy thông tin các ví
    const systemPocket = await Pocket.findOne({ type: 'system' });
    const bankPocket = await Pocket.findOne({ type: 'bank' });

    console.log(`[Ban đầu] Ví hệ thống (System): ID = ${systemPocket.id}, Số dư = ${systemPocket.balance.toLocaleString()} VND`);
    console.log(`[Ban đầu] Ví ngân hàng (Bank):   ID = ${bankPocket.id}, Số dư = ${bankPocket.balance.toLocaleString()} VND`);

    // Lấy thông tin admin
    const admin = await Customer.findOne({ role: 'admin' });
    let adminPocket = await Pocket.findOne({ owner: admin.id });
    if (!adminPocket) {
      adminPocket = await Pocket.create({
        owner: admin.id,
        type: 'customer',
        balance: 0,
        checksum: generateChecksum({
          owner: admin.id,
          type: 'customer',
          currency: 'VND',
          balance: 0,
        }),
      }).fetch();
      console.log('[Setup] Tạo ví cho admin vì chưa có.');
    }
    console.log(`[Ban đầu] Ví Admin (Người gửi chuyển khoản): ID = ${adminPocket.id}, Số dư = ${adminPocket.balance.toLocaleString()} VND`);

    // Tìm hoặc tạo khách hàng test
    let testCustomer = await Customer.findOne({ phone: '123456789' });
    if (!testCustomer) {
      testCustomer = await Customer.create({
        phone: '123456789',
        email: 'test@example.com',
        name: 'Anh Tuấn Phạm',
        password: bcrypt.hashSync('1', 10),
        pin: bcrypt.hashSync('1', 10),
        role: 'customer',
      }).fetch();
    }
    
    let testCustomerPocket = await Pocket.findOne({ owner: testCustomer.id });
    if (!testCustomerPocket) {
      testCustomerPocket = await Pocket.create({
        owner: testCustomer.id,
        type: 'customer',
        balance: 0,
        checksum: generateChecksum({
          owner: testCustomer.id,
          type: 'customer',
          currency: 'VND',
          balance: 0,
        }),
      }).fetch();
    }
    console.log(`[Ban đầu] Ví khách hàng test: ID = ${testCustomerPocket.id}, Số dư = ${testCustomerPocket.balance.toLocaleString()} VND\n`);

    // Helper to get balances
    const getBalances = async () => {
      const sys = await Pocket.findOne({ type: 'system' });
      const bnk = await Pocket.findOne({ type: 'bank' });
      const adm = await Pocket.findOne({ owner: admin.id });
      const cus = await Pocket.findOne({ owner: testCustomer.id });
      return { sys: sys.balance, bnk: bnk.balance, adm: adm.balance, cus: cus.balance };
    };

    // ==========================================
    // TEST 1: CASHIN_FREE (Nạp tiền miễn phí)
    // ==========================================
    console.log('--- TEST 1: Nạp tiền miễn phí 1.000.000 VND (CASHIN_FREE) ---');
    let balBefore = await getBalances();

    // Bước 1: Yêu cầu
    let reqResult = await TransactionService.request({
      serviceCode: 'CASHIN_FREE',
      receiverPhone: '123456789',
      amount: 1000000
    }, admin);
    
    // Bước 2: Xác nhận
    await TransactionService.confirm({
      transRefId: reqResult.transRefId
    }, admin);

    // Bước 3: Xác thực (chạy ngầm)
    await TransactionService.verify({
      transRefId: reqResult.transRefId
    }, admin);

    let balAfter = await getBalances();
    console.log(`-> Kết quả Số dư:`);
    console.log(`   + Ví ngân hàng (Bank): ${balBefore.bnk.toLocaleString()} -> ${balAfter.bnk.toLocaleString()} VND (Thay đổi: ${(balAfter.bnk - balBefore.bnk).toLocaleString()} VND)`);
    console.log(`   + Ví khách hàng:       ${balBefore.cus.toLocaleString()} -> ${balAfter.cus.toLocaleString()} VND (Thay đổi: ${(balAfter.cus - balBefore.cus).toLocaleString()} VND)`);
    console.log(`   + Ví hệ thống (Fee):   ${balBefore.sys.toLocaleString()} -> ${balAfter.sys.toLocaleString()} VND (Thay đổi: ${(balAfter.sys - balBefore.sys).toLocaleString()} VND)`);
    
    if (balAfter.bnk - balBefore.bnk === -1000000 && balAfter.cus - balBefore.cus === 1000000 && balAfter.sys - balBefore.sys === 0) {
      console.log('=> ĐẠT (Ví ngân hàng bị trừ 1M, Ví khách hàng được cộng 1M, Hệ thống giữ nguyên)');
    } else {
      console.error('=> LỖI: Cập nhật số dư không đúng nguồn!');
    }
    console.log();

    // ==========================================
    // TEST 2: CASHIN_FEE (Nạp tiền có phí 5.000 VND)
    // ==========================================
    console.log('--- TEST 2: Nạp tiền có phí 500.000 VND, Phí 5.000 VND (CASHIN_FEE) ---');
    balBefore = await getBalances();

    // Bước 1: Yêu cầu
    reqResult = await TransactionService.request({
      serviceCode: 'CASHIN_FEE',
      receiverPhone: '123456789',
      amount: 500000
    }, admin);
    
    // Bước 2: Xác nhận
    await TransactionService.confirm({
      transRefId: reqResult.transRefId
    }, admin);

    // Bước 3: Xác thực (chạy ngầm)
    await TransactionService.verify({
      transRefId: reqResult.transRefId
    }, admin);

    balAfter = await getBalances();
    console.log(`-> Kết quả Số dư:`);
    console.log(`   + Ví ngân hàng (Bank): ${balBefore.bnk.toLocaleString()} -> ${balAfter.bnk.toLocaleString()} VND (Thay đổi: ${(balAfter.bnk - balBefore.bnk).toLocaleString()} VND)`);
    console.log(`   + Ví khách hàng:       ${balBefore.cus.toLocaleString()} -> ${balAfter.cus.toLocaleString()} VND (Thay đổi: ${(balAfter.cus - balBefore.cus).toLocaleString()} VND)`);
    console.log(`   + Ví hệ thống (Fee):   ${balBefore.sys.toLocaleString()} -> ${balAfter.sys.toLocaleString()} VND (Thay đổi: ${(balAfter.sys - balBefore.sys).toLocaleString()} VND)`);
    
    if (balAfter.bnk - balBefore.bnk === -500000 && balAfter.cus - balBefore.cus === 495000 && balAfter.sys - balBefore.sys === 5000) {
      console.log('=> ĐẠT (Ví ngân hàng bị trừ 500k, Ví khách hàng tăng 495k, Ví hệ thống tăng 5k phí)');
    } else {
      console.error('=> LỖI: Cập nhật số dư nạp tiền có phí không đúng nguồn!');
    }
    console.log();

    // ==========================================
    // TEST 3: CHUYỂN KHOẢN P2P (Admin sang Khách hàng, Phí 100 VND)
    // ==========================================
    console.log('--- TEST 3: Chuyển khoản P2P 100.000 VND, Phí 100 VND (Admin -> Khách hàng) ---');
    const newAdminBalance = 200000;
    await Pocket.updateOne({ owner: admin.id }).set({
      balance: newAdminBalance,
      checksum: generateChecksum({
        owner: admin.id,
        type: 'customer',
        currency: 'VND',
        balance: newAdminBalance,
      }),
    });
    balBefore = await getBalances();

    // Bước 1: Yêu cầu
    reqResult = await TransactionService.request({
      serviceCode: 'P2P',
      receiverPhone: '123456789',
      amount: 100000
    }, admin);
    
    // Bước 2: Xác nhận
    await TransactionService.confirm({
      transRefId: reqResult.transRefId
    }, admin);

    // Bước 3: Xác thực PIN ('1')
    await TransactionService.verify({
      transRefId: reqResult.transRefId,
      pin: '1'
    }, admin);

    balAfter = await getBalances();
    console.log(`-> Kết quả Số dư:`);
    console.log(`   + Ví Admin (Người gửi): ${balBefore.adm.toLocaleString()} -> ${balAfter.adm.toLocaleString()} VND (Thay đổi: ${(balAfter.adm - balBefore.adm).toLocaleString()} VND)`);
    console.log(`   + Ví khách hàng (Nhận): ${balBefore.cus.toLocaleString()} -> ${balAfter.cus.toLocaleString()} VND (Thay đổi: ${(balAfter.cus - balBefore.cus).toLocaleString()} VND)`);
    console.log(`   + Ví hệ thống (Fee):    ${balBefore.sys.toLocaleString()} -> ${balAfter.sys.toLocaleString()} VND (Thay đổi: ${(balAfter.sys - balBefore.sys).toLocaleString()} VND)`);
    console.log(`   + Ví ngân hàng (Bank):  ${balBefore.bnk.toLocaleString()} -> ${balAfter.bnk.toLocaleString()} VND (Thay đổi: ${(balAfter.bnk - balBefore.bnk).toLocaleString()} VND)`);
    
    if (balAfter.adm - balBefore.adm === -100100 && balAfter.cus - balBefore.cus === 100000 && balAfter.sys - balBefore.sys === 100 && balAfter.bnk - balBefore.bnk === 0) {
      console.log('=> ĐẠT (Ví gửi bị trừ 100.100đ, Ví nhận được cộng 100.000đ, Ví hệ thống tăng 100đ phí, Ngân hàng giữ nguyên)');
    } else {
      console.error('=> LỖI: Cập nhật số dư chuyển khoản P2P không đúng nguồn!');
    }
    console.log();

    // ==========================================
    // TEST 4: TẤN CÔNG SỬA DB LÉN (Tamper Detection)
    // ==========================================
    console.log('--- TEST 4: Phát hiện sửa lén số dư DB (Tamper Detection) ---');
    
    // Tự ý cập nhật số dư admin trực tiếp trong DB mà KHÔNG cập nhật checksum
    await Pocket.updateOne({ owner: admin.id }).set({ balance: 999999999 });

    try {
      // Thử tạo giao dịch mới
      reqResult = await TransactionService.request({
        serviceCode: 'P2P',
        receiverPhone: '123456789',
        amount: 10000
      }, admin);

      await TransactionService.confirm({
        transRefId: reqResult.transRefId
      }, admin);

      await TransactionService.verify({
        transRefId: reqResult.transRefId,
        pin: '1'
      }, admin);

      console.error('=> LỖI: Hệ thống chấp nhận giao dịch dù số dư bị sửa lén!');
    } catch (err) {
      if (err.message.includes('CHECKSUM_INVALID')) {
        console.log(`=> ĐẠT: Phát hiện sửa lén thành công! Chi tiết lỗi: ${err.message}`);
      } else {
        console.error(`=> LỖI: Lỗi không như mong đợi: ${err.message}`);
      }
    }
    console.log();

  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    sails.lower();
  }
});
