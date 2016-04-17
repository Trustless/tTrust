var amounts = $amounts;

var dao = web3.eth.contract($dao_abi).at('$dao_address');
console.log("Buying DAO tokens");
for (i = 0; i < eth.accounts.length; i++) {
    web3.eth.sendTransaction({
        from:eth.accounts[i],
        to: dao.address,
        gas:200000,
        value:web3.toWei(amounts[i], "ether")
    });
}

checkWork();

setTimeout(function() {
    miner.stop(0);
    addToTest('dao_fueled', dao.isFueled());
    addToTest('total_supply', parseInt(web3.fromWei(dao.totalSupply())));
    var balances = [];
    for (i = 0; i < eth.accounts.length; i++) {
        balances.push(parseInt(web3.fromWei(dao.balanceOf(eth.accounts[i]))));
    }
    addToTest('balances', balances);

    // now also try to purchase some extra tokens after the sale ended
    // note we use buyTokenProxy() directly because with the edited code
    // for the test the fallback function becomes a DAO donation code right
    // after the end of the sale period
    dao.buyTokenProxy.sendTransaction(eth.accounts[0],{
        from:eth.accounts[0],
        to: dao.address,
        gas:200000,
        value:web3.toWei(20, "ether")
    });
    // and confirm balance is still the same
    checkWork();
    addToTest('user0_after', parseInt(web3.fromWei(dao.balanceOf(eth.accounts[0]))));
    testResults();
}, $wait_ms);
console.log("Wait for end of sale");
miner.start(1);
