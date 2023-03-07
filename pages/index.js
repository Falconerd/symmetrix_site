// import { useState, useEffect } from "react"
// import { ethers } from "ethers"
// import { signMessage } from "@/utils/sign"
import { RiExternalLinkFill } from "react-icons/ri"
// import { deposit } from "@/utils/deposit"
import farmAbi from "@/abi/farm.json"
import coreAbi from "@/abi/core.json"
// import erc20Abi from "@/abi/erc20.json"
//
//     function Minter({ pair }) {
//         const [amount, setAmount] = useState("100")
//
//         return (
//             <>
//             <input className="w-12 rounded-lg bg-slate-300 text-black px-1 text-sm text-center mx-2" value={amount} onChange={event => setAmount(event.target.value)} />
//             <button className="bg-slate-300 text-sm text-black rounded-lg px-2">Mint</button>
//             </>
//         )
//     }
//
// function Deposit({ amount, onChangeDepositAmount }) {
//     return (
//         <input className="w-12 rounded-lg bg-slate-300 text-black px-1 text-sm text-center mx-2" value={amount} onChange={event => onChangeDepositAmount(event.target.value)} />
//     )
// }
//
//
// function Row({ variant, pair, apr, tvl, total, isApproved, isConnected, onClickConnect, onClickDeposit, onChangeDepositAmount, depositAmount }) {
//     const formatter = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         maximumFractionDigits: 0
//     })
//
//     const radius = 32
//     const lineX = 13
//     let cssColor = "border-yellow-500 shadow-yellow-500/50"
//     let cssButton = "bg-yellow-500 shadow-yellow-500/50"
//     let hexColor = "#eab308"
//     let lineY = 24
//     let triangleY = 9
//
//     if (variant == "water" || variant == "earth") {
//         lineY = 54
//         triangleY = 80 - triangleY
//         cssColor = "border-green-500 shadow-green-500/50"
//         cssButton = "bg-green-500 shadow-green-500/50"
//         hexColor="#22c55e"
//         if (variant == "water") {
//             cssColor = "border-cyan-500 shadow-cyan-500/50"
//             hexColor="#06b6d4"
//             cssButton = "bg-cyan-500 shadow-cyan-500/50"
//         }
//     } else if (variant == "fire") {
//         cssColor = "border-orange-500 shadow-orange-500/50"
//         hexColor = "#f97316"
//         cssButton = "bg-orange-500 shadow-orange-500/50"
//     } else if (variant == "void") {
//         cssColor = "border-purple-500 shadow-purple-500/50"
//         cssButton = "bg-purple-500 shadow-purple-500/50"
//         hexColor="#a855f7"
//     }
//
//     const delta = (tvl / total * 100 - 25.0).toFixed(2)
//
//     return (
//         <div className={"text-lg rounded-full border-2 my-6 flex flex-initial justify-between items-center shadow-lg " + cssColor}>
//         <svg height="80" width="80">
//         <circle cx="40" cy="40" r={radius} stroke={hexColor} strokeWidth="2" fill="black" />
//         {variant == "void" &&
//             <polygon points={`${lineX},${lineY} 40,${80-triangleY} ${80-lineX},${lineY}`} stroke={hexColor} strokeWidth="2" fill="black" />
//         }
//         <polygon points={`${lineX},${80-lineY} 40,${triangleY} ${80-lineX},${80-lineY}`} stroke={hexColor} strokeWidth="2" fill="black" />
//         {(variant == "air" || variant == "earth") &&
//             <line x1={lineX} y1={lineY} x2={80-lineX} y2={lineY} stroke={hexColor} strokeWidth="2" />
//         }
//         </svg>
//         {variant == "void" ? <>
//             <div className="w-28 pl-2"></div>
//             {/*<div className="w-28">{apr}</div>*/}
//             <div className="w-28">{formatter.format(tvl)}</div>
//             <div className="w-28 font-mono text-sm">
//             <pre>this:  103%</pre>
//             <pre>last:  184%</pre>
//             <pre>next: ~137%</pre>
//             </div>
//             <div className="pr-4 w-28">
//             {isConnected ?
//                 <>
//                 <Deposit amount={depositAmount} onChangeDepositAmount={onChangeDepositAmount} />
//                 <button className={"shadow-lg text-sm text-black rounded-full p-2 " + cssButton} onClick={onClickDeposit}>Deposit</button>
//                 </>
//                 :
//                 <button className={"shadow-lg text-sm text-black rounded-full p-2 " + cssButton} onClick={onClickConnect}>Connect</button>}
//             </div>
//             </> : <>
//             <div className="w-28 pl-2 flex flex-col">
//             <>{pair}</>
//             <div className="flex">
//             <Minter pair={pair} />
//             </div>
//             </div>
//             {/*<div className="w-28">{apr}</div>*/}
//             <div className="w-28">{formatter.format(tvl)}</div>
//             <div className="w-28">{delta > 0 ? `+${delta}` : delta}%</div>
//             <div className="pr-4 w-28">
//             {isConnected ?
//                 <>
//                 <Deposit amount={depositAmount} onChangeDepositAmount={onChangeDepositAmount} />
//                 <button className={"shadow-lg text-sm text-black rounded-full p-2 " + cssButton} onClick={onClickDeposit}>Deposit</button>
//                 </>
//                 :  <button className={"shadow-lg text-sm text-black rounded-full p-2 " + cssButton} onClick={onClickConnect}>Connect</button>}
//             </div>
//             </>}
//         </div>
//     )
// }
//
    // export default function Home() {
        //     const farmAirTvl = 21332.43881
        //     const farmFireTvl = 12103
        //     const farmWaterTvl = 5697
        //     const farmEarthTvl = 18473
        //     const totalFarmsTvl = farmAirTvl + farmFireTvl + farmWaterTvl + farmEarthTvl
        //
            //     const [haveMetamask, setHaveMetamask] = useState(true)
        //     const [client, setClient] = useState({
            //         isConnected: false, adress: null, isApproved0: false, isApprovedFarm1: false, isApprovedFarm2: false, isApprovedFarm3: false, isApprovedVault: false
            //     })
        //
            //     async function checkConnection() {
                //         const { ethereum } = window
                //         if (ethereum) {
                    //             setHaveMetamask(true)
                    //             const accounts = await ethereum.request({ method: "eth_accounts" })
                    //             if (accounts.length > 0) {
                        //                 setClient({ isConnected: true, address: accounts[0] })
                        //             } else {
                            //                 setClient({ isConnected: false })
                            //             }
                    //         } else {
                        //             setHaveMetamask(false)
                        //         }
                //     }
        //
            //     async function checkFarmAllowance(address) {
                //         const provider = new ethers.providers.Web3Provider(window.ethereum)
                //         const signer = provider.getSigner()
                //         const contract = new ethers.Contract(address, farmAbi, provider)
                //
                    //         return await contract.allowance(await signer.getAddress(), address)
                //     }
        //
            //     async function connectWeb3() {
                //         try {
                    //             const { ethereum } = window
                    //
                        //             if (!ethereum) {
                            //                 console.log("Metamask not detected")
                            //                 return
                            //             }
                    //
                        //             const accounts = await ethereum.request({ method: "eth_requestAccounts" })
                    //             setClient({ isConnected: true, address: accounts[0] })
                    //         } catch (error) {
                        //             console.log("Error connecting to metamask", error)
                        //         }
                //     }
        //
            //     useEffect(() => {
                //         checkConnection()
                //     }, [])
        //
            //     useEffect(() => {
                //         async function check() {
                    //             if (client.isConnected) {
                        //                 const allowance = await checkFarmAllowance("0x7Dc222Cd2affc0DAB01454f7a981E5c810Ae4763")
                        //                 setRes(allowance)
                        //             }
                    //         }
                //         check()
                //     }, [client])
        //
            //     const [res, setRes] = useState({})
        //
            //     useEffect(() => {
                //         async function check() {
                    //             //const x = await checkAllowance("0x7Dc222Cd2affc0DAB01454f7a981E5c810Ae4763", erc20Abi)
                    //             //setRes(x)
                    //         }
                //         check()
                //     }, [])
        //
            //     const [hasApprovedAir, setHasApprovedAir] = useState(false)
        //     const [hasApprovedFire, setHasApprovedFire] = useState(false)
        //     const [hasApprovedWater, setHasApprovedWater] = useState(false)
        //     const [hasApprovedEarth, setHasApprovedEarth] = useState(false)
        //     const [hasApprovedVoid, setHasApprovedVoid] = useState(false)
        //
            //     const [farmAirAPR, setFarmAirAPR] = useState(0)
        //     const [farmFireAPR, setFarmFireAPR] = useState(0)
        //     const [farmWaterAPR, setFarmWaterAPR] = useState(0)
        //     const [farmEarthAPR, setFarmEarthAPR] = useState(0)
        //     const [farmVoidAPR, setFarmVoidAPR] = useState(0)
        //
            //     const [depositAmountAir, setDepositAmountAir] = useState(0);
        //
            //     return (
                //         <div className="max-w-2xl m-auto text-center text-white">
                //             <h1 className="text-8xl">Symmetrix</h1>
                //             <div className="flex gap-1 justify-center my-4">
                //                 <a href="#" className="underline">How it works</a>
                //                 <RiExternalLinkFill />
                //             </div>
                //             <div className={"border-transparent text-xl font-bold rounded-full border-2 my-6 flex flex-initial justify-between items-center"}>
                //                 <div className="w-20"></div>
                //                 <div className="w-28 pl-2">Pair</div>
                //         {/*<div className="w-28">APR</div>*/}
                //                 <div className="w-28">TVL</div>
                //                 <div className="w-28">Delta</div>
                //                 <div className="pr-10 w-28"></div>
                //             </div>
                //             <div className="text-white text-sm font-mono">{JSON.stringify(client, null, 2)}</div>
                //             <div className="text-white text-sm font-mono">{JSON.stringify("allowance:")} {JSON.stringify(res, null, 2)}</div>
                //             <Row isConnected={client.isConnected} hasApproved={hasApprovedAir}   onClickConnect={connectWeb3} depositAmount={depositAmountAir} onChangeDepositAmount={setDepositAmountAir} onClickDeposit={() => deposit("0x7Dc222Cd2affc0DAB01454f7a981E5c810Ae4763", farmAbi, depositAmountAir)} variant="air"   pair="FakeLP0"   apr={`${farmAirAPR}%`} tvl={farmAirTvl}   total={totalFarmsTvl} />
                //             <Row isConnected={client.isConnected} hasApproved={hasApprovedFire}  onClickConnect={connectWeb3} depositAmount={depositAmountAir} onChangeDepositAmount={setDepositAmountAir} onClickDeposit={() => {}} variant="fire"  pair="FakeLP1"  apr={`${farmFireAPR}%`} tvl={farmFireTvl}  total={totalFarmsTvl} />
                //             <Row isConnected={client.isConnected} hasApproved={hasApprovedWater} onClickConnect={connectWeb3} depositAmount={depositAmountAir} onChangeDepositAmount={setDepositAmountAir} onClickDeposit={() => {}} variant="water" pair="FakeLP2"   apr={`${farmWaterAPR}%`} tvl={farmWaterTvl} total={totalFarmsTvl} />
                //             <Row isConnected={client.isConnected} hasApproved={hasApprovedEarth} onClickConnect={connectWeb3} depositAmount={depositAmountAir} onChangeDepositAmount={setDepositAmountAir} onClickDeposit={() => {}} variant="earth" pair="FakeLP3" apr={`${farmEarthAPR}%`} tvl={farmEarthTvl} total={totalFarmsTvl} />
                //             <hr className="border-white border border-dashed" />
                //             <div className={"border-transparent text-xl font-bold rounded-full border-2 my-6 flex flex-initial justify-between items-center"}>
                //                 <div className="w-20"></div>
                //                 <div className="w-28 pl-2">.</div>
                //             {/*<div className="w-28">APR</div>*/}
                //                 <div className="w-28">TVL</div>
                //                 <div className="w-28">Boost</div>
                //                 <div className="pr-10 w-28"></div>
                //             </div>
                //             <Row isConnected={client.isConnected} hasApproved={hasApprovedVoid} onClickConnect={connectWeb3} variant="void" apr="237%" tvl={4332} />
                //         {client.isConnected &&
                    //             <button className="bg-white" onClick={signMessage}>Sign</button>
                    //         }
                //         </div>
                //     )
        // }

import { ethers, BigNumber } from 'ethers';
import { 
    JsonRpcSigner, 
    Network, 
    Web3Provider 
} from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import circular from "circular";

function useMetamask() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [network, setNetwork] = useState(null);

    const [activeFarms, setActiveFarms] = useState([])
    const [totalValuesLocked, setTotalValuesLocked] = useState([])

    function setupProvider() {
        if (!window.ethereum) throw Error('Could not find Metamask extension');
        if (provider) return provider;

        const newProvider = new Web3Provider(window.ethereum);
        listenToEvents(newProvider);
        setProvider(newProvider);

        return newProvider
    }

    function listenToEvents(_) {
        window.ethereum.on('accountsChanged', (acc) => {
            setAccounts(acc)
        });
        window.ethereum.on('chainChanged', async (_) => {
            await connect()
        });
        window.ethereum.on('disconnect', (_) => {
        });
    } 

    async function connect() {
        const provider = setupProvider();
        const accounts = await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        const signer = provider.getSigner();
        setNetwork(network);
        setAccounts(accounts);
        setSigner(signer);

        updateProtocolData()
    }

    async function getAccounts() {
        const provider = setupProvider();
        const accounts = await provider.send("eth_accounts", []);
        setAccounts(accounts);
        return accounts;
    }

    async function deposit(to, amount) {
        const provider = setupProvider()
        const contract = new ethers.Contract(to, farmAbi, provider)
        const contractWithSigner = contract.connect(signer)
        await contractWithSigner.deposit(amount)
    }

    async function withdraw(to, amount) {
        const provider = setupProvider()
        const contract = new ethers.Contract(to, farmAbi, provider)
        const contractWithSigner = contract.connect(signer)
        await contractWithSigner.withdraw(amount)
    }

    async function updateProtocolData() {
        const provider = setupProvider()
        const contractCore = new ethers.Contract("0x38F835092e7AdBf925A3e70035ea832d5D709A88", coreAbi, provider)

        const farm0 = await contractCore.activeFarms(0)
        const farm1 = await contractCore.activeFarms(1)
        const farm2 = await contractCore.activeFarms(2)
        const farm3 = await contractCore.activeFarms(3)

        setActiveFarms([farm0, farm1, farm2, farm3])

        const contractFarm0 = new ethers.Contract(farm0, farmAbi, provider)
        const contractFarm1 = new ethers.Contract(farm1, farmAbi, provider)
        const contractFarm2 = new ethers.Contract(farm2, farmAbi, provider)
        const contractFarm3 = new ethers.Contract(farm3, farmAbi, provider)

        const tvl0 = await contractFarm0.totalValueLocked()
        const tvl1 = await contractFarm1.totalValueLocked()
        const tvl2 = await contractFarm2.totalValueLocked()
        const tvl3 = await contractFarm3.totalValueLocked()

        setTotalValuesLocked([tvl0, tvl1, tvl2, tvl3])
    }

    return { 
        signer,
        accounts,
        network,
        connect,
        getAccounts,
        deposit,
        withdraw,
        activeFarms,
        totalValuesLocked,
    }
}

function Connect({connect}) {
    return (
        <div className="text-center">
        <button className="text-white" onClick={connect}>Connect</button>
        </div>
    )
}

function Header() {
    return (
        <div className="max-w-2xl m-auto text-center text-white">
        <h1 className="text-8xl">Symmetrix</h1>
        <div className="flex gap-1 justify-center my-4">
        <a href="#" className="underline">How it works</a>
        <RiExternalLinkFill />
        </div>
        </div>
    )
}

function Body({signer, accounts, network, connect, getAccounts, deposit, withdraw, totalValuesLocked, activeFarms }) {
    useEffect(() => {
        if (!signer) {
            connect()
        }
    }, [connect, signer])

    if (accounts.length == 0) {
        return (
            <>
                <Connect connect={connect} />
            </>
        )
    }

    if (signer?.provider?.provider?.chainId != "0xfa2") {
        return (
            <div className="text-white">
                Wrong chain, please switch to Fantom Testnet
                <pre>{JSON.stringify({signer, accounts, network}, circular(), 2)}</pre>
            </div>
        )
    }

    return (
        <div className="text-white">
            <div>TVL: ${totalValuesLocked[0]?.div(BigNumber.from("1000000000000000000")).toString()}</div>
            <div>TVL: ${totalValuesLocked[1]?.div(BigNumber.from("1000000000000000000")).toString()}</div>
            <div>TVL: ${totalValuesLocked[2]?.div(BigNumber.from("1000000000000000000")).toString()}</div>
            <div>TVL: ${totalValuesLocked[3]?.div(BigNumber.from("1000000000000000000")).toString()}</div>
            <pre>{JSON.stringify(activeFarms, null, 2)}</pre>
        </div>
    )
}

export default function Home() {
    const { signer, accounts, network, connect, getAccounts, deposit, withdraw, totalValuesLocked, activeFarms } = useMetamask()

    return (
        <>
        <Header />
        <Body
            signer={signer}
            accounts={accounts}
            network={network}
            connect={connect}
            getAccounts={getAccounts}
            deposit={deposit}
            withdraw={withdraw}
            activeFarms={activeFarms}
            totalValuesLocked={totalValuesLocked}
        />
        </>
    )
}
