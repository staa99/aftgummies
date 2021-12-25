// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {ethers, run, upgrades} from 'hardhat'
import {AFTGummies} from 'typechain-types'
import '@openzeppelin/hardhat-upgrades'

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    await run('compile')

    // We get the contract to deploy
    const AFTGummies = await ethers.getContractFactory('AFTGummies')
    const aftGummies = await upgrades.deployProxy(AFTGummies, [], {initializer: 'initialize'}) as AFTGummies

    await aftGummies.deployed()

    console.log('AFT Gummies deployed to:', aftGummies.address)

    const tx = await aftGummies.initialize()
    console.log('Initializing...')
    await tx.wait()
    console.log('Initialized')

    console.log('Token name:', await aftGummies.name())
    console.log('Token symbol:', await aftGummies.symbol())

    let data = await aftGummies.totalSupply()
    console.log('Total supply:', data.toString())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
