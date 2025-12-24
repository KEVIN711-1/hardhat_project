import { expect } from "chai";
import { network } from "hardhat";


// 连接以太坊环境
// 假设 network.connect() 返回：
// {
//   ethers: [object],    // ethers.js 库实例
//   provider: [object],  // 网络提供者
//   signer: [object],    // 签名者
//   // ... 其他属性
// }

// 传统写法：先获取对象，再取属性
// const networkObj = await network.connect();
// const ethers = networkObj.ethers;

// 解构写法：直接提取属性
// const { ethers } = await network.connect();
// 等价于 const ethers = (await network.connect()).ethers;
const { ethers } = await network.connect();
//await  等待网络连接返回，如果没返回就会阻塞，否则超时报错

describe("Counter", function () {
  // it("测试用例描述", function() {
  //   // 测试逻辑
  // });

  // it 的第一个参数为测试用例期望的结果描述
  // it 的第二个参数为测试逻辑
  it("Should emit the Increment event when calling the inc() function", async function () {
    // 这行代码做以下事情：
    // 1. 在编译后的合约中查找名为 "Counter" 的合约
    // 2. 准备部署交易
    // 3. 返回一个 Promise，该Promise解析为合约实例
    const counter = await ethers.deployContract("Counter");
    // 部署完成后，counter变量包含：
    // counter = {
    //   address: "0x123...",          // 合约地址
    //   inc: function() {...},        // 合约函数
    //   x: function() {...},          // 状态变量getter
    //   queryFilter: function() {...},// 事件查询
    //   filters: { Increment: ... },  // 事件过滤器
    //   // ... 其他属性和方法
    // }
    await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
    // 1. expect(counter.inc())     ← 开始，获取交易Promise
    // 2. .to.emit(...)             ← 检查事件， counter 合约中的 Increment事件
    // 3. .withArgs(...)            ← 检查事件参数 是否为1 n为数据类型
  });

  it("The sum of the Increment events should match the current value", async function () {
    const counter = await ethers.deployContract("Counter");
    const deploymentBlockNumber = await ethers.provider.getBlockNumber();
  //   记录部署时的区块号
  //   部署完成后立即查询当前区块号
  //   例如：区块号 = 100

    // run a series of increments
    // 第10次：incBy(10) → x 增加 10
    for (let i = 1; i <= 10; i++) {
      await counter.incBy(i);
    }
    //queryFilter 是 查询区块链事件日志的方法，不是调用合约函数
    const events = await counter.queryFilter(
      counter.filters.Increment(), //过滤,只查看counter中Increment事件的触发信息
      deploymentBlockNumber, //  起始：counter部署时的区块
      "latest", // 结束：最新的区块 
    );

    // check that the aggregated events match the current value
    let total = 0n;
    for (const event of events) {
      //遍历所有过滤出来的事件信息，累加他们入参的值 total
      total += event.args.by;
    }

    // 期待调用counter 中的 public 遍历x的值能够等于total
    expect(await counter.x()).to.equal(total);
  });
});
