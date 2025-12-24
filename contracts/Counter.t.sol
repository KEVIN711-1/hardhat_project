// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Counter} from "./Counter.sol"; // 导入要测试的合约
import {Test} from "forge-std/Test.sol"; // 导入Foundry测试库

// Solidity tests are compatible with foundry, so they
// use the same syntax and offer the same functionality.

contract CounterTest is Test {  // 继承自Test基类
  Counter counter;  // 声明Counter合约实例
  
  // 1. Foundry发现 CounterTest 合约
  //     ↓
  // 2. 对每个测试函数（test_开头）：
  //     ↓
  // 3. 先自动调用 setUp() ← 这是关键！
  function setUp() public {
    counter = new Counter(); // 部署新的Counter实例
  }

  function test_InitialValue() public view {
    require(counter.x() == 0, "Initial value should be 0");
  }

  function testFuzz_Inc(uint8 x) public {
    for (uint8 i = 0; i < x; i++) {
      counter.inc();
    }
    require(counter.x() == x, "Value after calling inc x times should be x");
  }

  function test_IncByZero() public {
    vm.expectRevert();        // 1. 声明：期待下一行代码会回滚
    counter.incBy(0);         // 2. 执行：用参数0调用函数
  }
}
