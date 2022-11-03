# Geode Swap Contract Uninitialized on Deploy

Uninitialized Geode Swap contract allows attacker to initialize Swap contract with custom values leading to unusable contract and potential loss of user funds. 

Attacker can call the [initialize function](https://snowtrace.io/address/0xCD8951A040Ce2c2890d3D92Ea4278FF23488B3ac?utm_source=immunefi#writeContract#F2) of swap contract on mainnet and insert custom values.

This vulnerability is currently live in this contract: https://snowtrace.io/address/0xCD8951A040Ce2c2890d3D92Ea4278FF23488B3ac?utm_source=immunefi#code


## To replicate attack on fork of mainnet:
```sh
npx hardhat test test/geodeTest.test.js
```

Currently anyone can call the initialize function on mainnet and input custom values. 

In the tests, the lpTokenTargetAddress is the hackers custom contract. When the Geode Swap contract calls
the lpTokenTarget contract, the owner is set to tx.orgin, not msg.sender. This means that the hacker is the owner of the LP token contract not the Swap contract. This is to show how a loss of funds could occur if a user sent funds to the Swap contract.
(contracts/dependencies/openzeppelin/OwnableUpgradeable.sol/line-86)


### Impact:

#### 1) Direct theft of any user funds, whether at-rest or in-motion, other than unclaimed yield

* If vulnerability exploited, any funds sent to swap contract will be lost.

#### 2) Permanent freezing of funds, including gAVAX (ERC1155) and DWP

* If vulnerability exploited, any funds sent to swap contract will be lost.


#### 3) Protocol insolvency

* If vulnerability exploited, any funds sent to swap contract will be lost.

#### 4) Griefing (e.g. no profit motive for an attacker, but damage to the users or the protocol)

* If vulnerability exploited, this leads to an unusable contract, requiring developers to redeploy. 




## How to patch this vulnerability: 

Call the initialize function in the Geode swap contract after deploy, or in the constructor on deploy.

Example of fix:
```sh
deploy/mainnet/004_deploy_Swap.js
```


