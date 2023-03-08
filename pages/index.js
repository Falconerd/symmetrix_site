import { RiExternalLinkFill } from "react-icons/ri"
import farmAbi from "@/abi/farm.json"
import coreAbi from "@/abi/core.json"
import lpAbi from "@/abi/lp.json"
import houseTokenAbi from "@/abi/token.json"
import stakedTokenAbi from "@/abi/staked_token.json"
import { ethers, BigNumber } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";

const _1e18 = BigNumber.from("1000000000000000000")
const _zero = BigNumber.from("0")

function useMetamask() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [network, setNetwork] = useState(null);

    // Definitely change this from SoA to AoS
    const [activeFarms, setActiveFarms] = useState(["", "", "", ""])
    const [lpTokenAddresses, setLpTokenAddresses] = useState(["", "", "", ""])
    const [totalValuesLocked, setTotalValuesLocked] = useState([0, 0, 0, 0])
    const [score, setScore] = useState(0)
    const [deltas, setDeltas] = useState([0, 0, 0, 0])
    const [balances, setBalances] = useState([0, 0, 0, 0])
    const [balancesRaw, setBalancesRaw] = useState([_zero, _zero, _zero, _zero])
    const [approvals, setApprovals] = useState([_zero, _zero, _zero, _zero])
    const [lpTokenNames, setLpTokenNames] = useState(["", "", "", ""])
    const [farmBalances, setFarmBalances] = useState([_zero, _zero, _zero, _zero])

    const [vault, setVault] = useState({
        address: "",
        stake: "",
        totalValueLocked: "",
        balance: BigNumber.from(0),
        approval: BigNumber.from(0),
    })

    function setupProvider() {
        if (!window.ethereum) throw Error("Could not find Metamask extension");
        if (provider) return provider;

        const newProvider = new Web3Provider(window.ethereum);
        listenToEvents(newProvider);
        setProvider(newProvider);

        return newProvider
    }

    function listenToEvents(_) {
        window.ethereum.on("accountsChanged", (acc) => {
            setAccounts(acc)
        });
        window.ethereum.on("chainChanged", async (_) => {
            await connect()
        });
        window.ethereum.on("disconnect", (_) => {
        });
    } 

    async function connect() {
        const provider = setupProvider();
        const accounts = await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        const signer = provider.getSigner(accounts[0]);
        setNetwork(network);
        setAccounts(accounts);
        setSigner(signer);

        if (provider?.provider?.chainId == "0xfa2") {
            await updateProtocolData(provider)
        }
    }

    async function getAccounts() {
        const provider = setupProvider();
        const accounts = await provider.send("eth_accounts", []);
        setAccounts(accounts);
        return accounts;
    }

    async function approve(farm, lp) {
        const provider = setupProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(lp, lpAbi, provider)
        const contractWithSigner = contract.connect(signer)
        await contractWithSigner.approve(farm, ethers.constants.MaxUint256)
        await updateProtocolData(provider)
    }

    async function deposit(to, amount) {
        amount = BigNumber.from(amount).mul(_1e18)
        const provider = setupProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(to, farmAbi, provider)
        const contractWithSigner = contract.connect(signer)
        await contractWithSigner.deposit(amount)
        await updateProtocolData(provider)
    }

    async function withdraw(to, amount) {
        amount = BigNumber.from(amount).mul(_1e18)
        const provider = setupProvider()
        const contract = new ethers.Contract(to, farmAbi, provider)
        const signer = provider.getSigner()
        const contractWithSigner = contract.connect(signer)
        await contractWithSigner.withdraw(amount)
        await updateProtocolData(provider)
    }

    async function claim(farm) {
        const provider = setupProvider()
        const contract = new ethers.Contract(farm, farmAbi, provider)
        const signer = provider.getSigner()
        const contractWithSigner = contract.connect(signer)
        await contractWithSigner.getReward()
        await updateProtocolData(provider)
    }

    async function mint(token, amount) {
        const provider = setupProvider()
        const contract = new ethers.Contract(token, lpAbi, provider)
        const signer = provider.getSigner()
        const contractWithSigner = contract.connect(signer)
        try {
            await contractWithSigner.mint(amount)
            await updateProtocolData(provider)
        } catch (e) {
            console.log(e)
            await updateProtocolData(provider)
        }
    }

    async function updateProtocolData(provider) {
        const contractCore = new ethers.Contract("0xE9D4fb18527f008d135d26808f07Ae22DCac777E", coreAbi, provider)

        const [farm0, farm1, farm2, farm3, houseToken, stakedToken] = await Promise.all([
            await contractCore.activeFarms(0),
            await contractCore.activeFarms(1),
            await contractCore.activeFarms(2),
            await contractCore.activeFarms(3),
            await contractCore.houseToken(),
            await contractCore.stakedToken(),
        ])

        setActiveFarms([farm0, farm1, farm2, farm3])

        const contractFarm0 = new ethers.Contract(farm0, farmAbi, provider)
        const contractFarm1 = new ethers.Contract(farm1, farmAbi, provider)
        const contractFarm2 = new ethers.Contract(farm2, farmAbi, provider)
        const contractFarm3 = new ethers.Contract(farm3, farmAbi, provider)

        const [tvl0, tvl1, tvl2, tvl3, b0, b1, b2, b3] = await Promise.all([
            await contractFarm0.totalValueLocked(),
            await contractFarm1.totalValueLocked(),
            await contractFarm2.totalValueLocked(),
            await contractFarm3.totalValueLocked(),
            await contractFarm0.balanceOf(provider.provider.selectedAddress),
            await contractFarm1.balanceOf(provider.provider.selectedAddress),
            await contractFarm2.balanceOf(provider.provider.selectedAddress),
            await contractFarm3.balanceOf(provider.provider.selectedAddress),
        ])

        setFarmBalances([b0, b1, b2, b3])

        const tvls = [tvl0, tvl1, tvl2, tvl3]

        setTotalValuesLocked(tvls.map(x => x.div(BigNumber.from("1000000000000000000")).toNumber()))

        let s = await contractCore.score()
        s = s.toNumber()
        setScore(s)

        const total = tvls.reduce((acc, x) => x.div(_1e18).toNumber() + acc, 0)

        console.log(total)

        setDeltas(tvls.map(x => {
            if (x.gt(_1e18)) {
                return toSignedString(((x.div(_1e18).toNumber() / total) * 100 - 25).toFixed(2))
            } else {
                return (0).toFixed(2)
            }
        }))

        const fetchedLpTokens = await Promise.all([
            await contractFarm0.stake(),
            await contractFarm1.stake(),
            await contractFarm2.stake(),
            await contractFarm3.stake(),
        ])

        setLpTokenAddresses(fetchedLpTokens)

        const contractLP0 = new ethers.Contract(fetchedLpTokens[0], lpAbi, provider)
        const contractLP1 = new ethers.Contract(fetchedLpTokens[1], lpAbi, provider)
        const contractLP2 = new ethers.Contract(fetchedLpTokens[2], lpAbi, provider)
        const contractLP3 = new ethers.Contract(fetchedLpTokens[3], lpAbi, provider)
        
        const fetchedLPInfo = await Promise.all([
            await contractLP0.balanceOf(provider.provider.selectedAddress),
            await contractLP1.balanceOf(provider.provider.selectedAddress),
            await contractLP2.balanceOf(provider.provider.selectedAddress),
            await contractLP3.balanceOf(provider.provider.selectedAddress),
            await contractLP0.allowance(provider.provider.selectedAddress, farm0),
            await contractLP1.allowance(provider.provider.selectedAddress, farm1),
            await contractLP2.allowance(provider.provider.selectedAddress, farm2),
            await contractLP3.allowance(provider.provider.selectedAddress, farm3),
            await contractLP0.name(),
            await contractLP1.name(),
            await contractLP2.name(),
            await contractLP3.name(),
        ])

        setBalancesRaw(fetchedLPInfo.slice(0, 4))
        setBalances(fetchedLPInfo.slice(0, 4).map(x => {
            if (x.gt(_1e18)) { 
                return x.div("1000000000000000000").toString()
            } else {
                return "0"
            }
        }))
        setApprovals(fetchedLPInfo.slice(4, 8))
        setLpTokenNames(fetchedLPInfo.slice(8, 12))

        const contractStakedToken = new ethers.Contract(stakedToken, stakedTokenAbi, provider)
        const contractHouseToken = new ethers.Contract(houseToken, houseTokenAbi, provider)

        const [vaultTotalSupply, vaultBalance, vaultApproval] = await Promise.all([
            await contractStakedToken.totalSupply(),
            await contractStakedToken.balanceOf(provider.provider.selectedAddress),
            await contractHouseToken.allowance(provider.provider.selectedAddress, stakedToken),
        ])

        setVault({
            stake: houseToken,
            address: stakedToken,
            totalSupply: vaultTotalSupply,
            totalValueLocked: vaultTotalSupply.div(_1e18).toNumber(),
            balance: vaultBalance,
            approval: vaultApproval,
        })
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
        score,
        deltas,
        balances,
        approve,
        approvals,
        balancesRaw,
        mint,
        lpTokenAddresses,
        lpTokenNames,
        vault,
        farmBalances,
        claim,
    }
}

function toSignedString(n) {
    return n > 0 ? `+${n}` : `${n}`
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
        {/*<a href="#" className="underline">How it works</a>
            <RiExternalLinkFill />
            */}
        </div>
        </div>
    )
}

function Body({ mm }) {
    const {
        signer,
        accounts,
        network,
        connect,
        getAccounts,
        deposit,
        withdraw,
        totalValuesLocked,
        activeFarms,
        score,
        deltas,
        balances,
        approve,
        approvals,
        balancesRaw,
        mint,
        lpTokenAddresses,
        lpTokenNames,
        vault,
        farmBalances,
        claim,
    } = mm

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
            </div>
        )
    }

    return (
        <div className="text-white max-w-5xl mx-auto p-4">

            <div className="border-transparent text-xl font-bold rounded-full border-2 my-6 flex flex-initial justify-between items-center">
                <div className="w-20" />
                <div className="pl-2">Pair</div>
                <div className="pl-2">TWTVL</div>
                <div className="pl-2">Delta</div>
                <div className="pr-4 flex gap-2">
                    <div className="w-32 p-2" />
                    <div className="w-24 p-2" />
                </div>
            </div>
            <Row variant="yellow" address={activeFarms[0]} lpTokenAddress={lpTokenAddresses[0]} lpTokenName={lpTokenNames[0]} tvl={totalValuesLocked[0]} delta={deltas[0]} score={score} balance={balances[0]} balanceRaw={balancesRaw[0]} deposit={deposit} withdraw={withdraw} approve={approve} approval={approvals[0]} mint={mint} farmBalance={farmBalances[0]} claim={claim} />
            <Row variant="orange" address={activeFarms[1]} lpTokenAddress={lpTokenAddresses[1]} lpTokenName={lpTokenNames[1]} tvl={totalValuesLocked[1]} delta={deltas[1]} score={score} balance={balances[1]} balanceRaw={balancesRaw[1]} deposit={deposit} withdraw={withdraw} approve={approve} approval={approvals[1]} mint={mint} farmBalance={farmBalances[1]} claim={claim} />
            <Row variant="cyan"   address={activeFarms[2]} lpTokenAddress={lpTokenAddresses[2]} lpTokenName={lpTokenNames[2]} tvl={totalValuesLocked[2]} delta={deltas[2]} score={score} balance={balances[2]} balanceRaw={balancesRaw[2]} deposit={deposit} withdraw={withdraw} approve={approve} approval={approvals[2]} mint={mint} farmBalance={farmBalances[2]} claim={claim} />
            <Row variant="green"  address={activeFarms[3]} lpTokenAddress={lpTokenAddresses[3]} lpTokenName={lpTokenNames[3]} tvl={totalValuesLocked[3]} delta={deltas[3]} score={score} balance={balances[3]} balanceRaw={balancesRaw[3]} deposit={deposit} withdraw={withdraw} approve={approve} approval={approvals[3]} mint={mint} farmBalance={farmBalances[3]} claim={claim} />

            <hr className="border-white border border-dashed" />

            <div className="border-transparent text-xl font-bold rounded-full border-2 my-6 flex flex-initial justify-between items-center">
                <div className="w-20" />
                <div className="pl-2">TVL</div>
                <div className="pl-2">Score</div>
                <div className="pr-4 flex gap-2">
                    <div className="w-32 p-2" />
                    <div className="w-24 p-2" />
                </div>
            </div>
            <Row
                variant="purple"
                address={vault.address}
                lpTokenAddress={vault.stake}
                tvl={vault.totalValueLocked}
                delta={score}
                score={score}
                balance={vault.balance.div(_1e18).toString()}
                balanceRaw={vault.balance}
                deposit={deposit}
                withdraw={withdraw}
                approve={approve}
                approval={vault.approval}
                claim={claim}
        //TODO
        farmBalance={_zero}
            />
            <div className="leading-relaxed">
                <h3 className="text-xl my-4">Explanation</h3>
                <ul class="list-disc">
                    <li>Symmetrix is a DeFi game about keeping the primal elements in balance.</li>
                    <li>Users are rewarded for keeping the current four active farms TVL close to each other.</li>
                    <li>Users are also rewarded with their usual LP token rewards (BOO), though there is a six hour delay.</li>
                    <li>The total value locked is recorded at most every 30 minutes, and the Equilibrium Mechanism calculates the score.</li>
                    <li>The score is between -50 and 100. Once the score crosses into positive numbers, emissions will increase by that percentage.</li>
                    <li>The emissions boost maxes out at +100%, and will not fall below +0% (the normal rate).</li>
                    <li>The boosted emissions last for the next epoch - six hours. The score during each epoch determines the emissions for the next.</li>
                    <li>Native LP rewards like BOO cannot be boosted.</li>
                    <li>The void element, denoted in purple, is a vault in which users can stake their SMX - the reward token, in exchange for vSMX.</li>
                    <li>vSMX has no utility in the beta, but will be used to vote for the next four active farms that will change weekly.</li>
                    <li><i>This site is a beta version. If state does not change, try refreshing - sorry.</i></li>
                </ul>
            {/*<p className="py-2">Get ready for Symmetrix, the exciting new DeFi game that challenges players to keep the primal elements in balance! As a beta version, you'll be one of the first to experience this cutting-edge game.</p>
                <p className="py-2">In Symmetrix, players earn rewards by maintaining the current four active farms at an equal Total Value Locked (TVL). Our Equilibrium Mechanism records TVL at most every 30 minutes and calculates a score between 0 and 100. Achieving a perfect score of 100 unlocks an impressive 100% boost in emissions for the next six hours.</p>
                <p className="py-2">But that's not all - Symmetrix also has the void element, denoted in purple, which allows players to stake their SMX token and earn sSMX in return. Although sSMX has no utility in the beta version, it will be used to vote for the next four active farms, which will change on a weekly basis.</p>
                <p className="py-2">Join the Symmetrix community today and discover the exciting world of DeFi gaming!</p>
                <p className="py-2">This is a beta version!</p>*/}
        </div>
        </div>
    )
}

const symbol = {
    radius: 32,
    lineX: 13,
    lineY: 24,
    triangleY: 9,
    hasBar: false,
    color: "#eab308",
}

const variants = {
    orange: {
        css: {
            row: "border-orange-500 shadow-orange-500/50",
            button: "bg-orange-500 shadow-orange-500/50",
            input: "border border-orange-500 shadow-orange-500/50",
        },
        symbol: {
            ...symbol,
            color: "#f97316",
        }
    },
    yellow: {
        css: {
            row: "border-yellow-500 shadow-yellow-500/50",
            button: "bg-yellow-500 shadow-yellow-500/50",
            input: "border border-yellow-500 shadow-yellow-500/50",
        },
        symbol: {
            ...symbol,
            hasBar: true,
        }
    },
    cyan: {
        css: {
            row: "border-cyan-500 shadow-cyan-500/50",
            button: "bg-cyan-500 shadow-cyan-500/50",
            input: "border border-cyan-500 shadow-cyan-500/50",
        },
        symbol: {
            ...symbol,
            rotation: 180,
            color: "#06b6d4"
        }
    },
    green: {
        css: {
            row: "border-green-500 shadow-green-500/50",
            button: "bg-green-500 shadow-green-500/50",
            input: "border border-green-500 shadow-green-500/50",
        },
        symbol: {
            ...symbol,
            rotation: 180,
            color: "#22c55e",
            hasBar: true
        }
    },
    purple: {
        css: {
            row: "border-purple-500 shadow-purple-500/50",
            button: "bg-purple-500 shadow-purple-500/50",
            input: "border border-purple-500 shadow-purple-500/50",
        },
        symbol: {
            ...symbol,
            color: "#a855f7",
            isVoid: true,
        },
    },
}
function AlchemicalSymbol({ variant }) {
    const {radius, color, lineX, lineY, triangleY, hasBar, isVoid, rotation = 0} = variants[variant].symbol
    return (
        <svg height="80" width="80" style={{ transform: `rotate(${rotation}deg)` }}>
            <circle cx="40" cy="40" r={radius} stroke={color} strokeWidth="2" fill="black" />
            {isVoid &&
                <polygon points={`${lineX},${lineY} 40,${80-triangleY} ${80-lineX},${lineY}`} stroke={color} strokeWidth="2" fill="black" />
            }
            <polygon points={`${lineX},${80-lineY} 40,${triangleY} ${80-lineX},${80-lineY}`} stroke={color} strokeWidth="2" fill="black" />
            {hasBar &&
                <line x1={lineX} y1={lineY} x2={80-lineX} y2={lineY} stroke={color} strokeWidth="2" />
            }
        </svg>
    )
}

function Mint({ name, address, onClickMint }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="font-bold text-white text-center text-sm">{name}</div>
            <button className="shadow-md text-sm w-24 text-black rounded-full px-2 bg-white shadow-white/50" onClick={() => onClickMint(address, 100)}>Mint 100</button>
        </div>
    )
}
            // button: "bg-green-500 shadow-green-500/50",
            // input: "border border-green-500 shadow-green-500/50",

function Row({ variant, balance, balanceRaw, address, lpTokenAddress, tvl, delta, score, deposit, withdraw, approve, approval, mint, lpTokenName, farmBalance, claim }) {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    })

    const [depositAmount, setDepositAmount] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState("")

    const css = variants[variant].css

    if (farmBalance.gt(_1e18)) {
        farmBalance = farmBalance.div(_1e18).toString()
    }

    const needsApproval = approval.lt(balanceRaw) || approval.eq(0)

    function handleApprove() {
        approve(address, lpTokenAddress);
    }

    function handleDeposit() {
        deposit(address, depositAmount);
        setDepositAmount("")
    }

    function handleWithdraw() {
        withdraw(address, withdrawAmount)
        setDepositAmount("")
    }

    function handleClaim() {
        claim(address)
    }

    return (
        <div className={"text-lg rounded-full border-2 my-6 flex flex-initial justify-between items-center shadow-lg " + css.row}>
            <AlchemicalSymbol variant={variant} />

            {/* later change this to pass in components */}
            {variant !== "purple" &&
            <div className="pl-2">
                <Mint name={lpTokenName} address={lpTokenAddress} onClickMint={mint} />
            </div>}
            <div className="pl-2">{formatter.format(tvl)}</div>
            <div className="pl-2">{delta}%</div>
            <div className="pr-4 flex gap-4">
                <div className="flex flex-col">
                    <input className={"shadow-md w-24 text-sm rounded-full text-white p-1 bg-black " + css.input} placeholder={"Bal: " + balance} value={depositAmount} onChange={event => setDepositAmount(event.target.value)} />

                    {needsApproval ? (
                        <button className={"shadow-md w-24 text-sm text-black rounded-full px-2 my-2 " + css.button} onClick={handleApprove}>Approve</button>
                    ) : (
                        <button className={"shadow-md w-24 text-sm text-black rounded-full px-2 my-2 " + css.button} onClick={handleDeposit}>Deposit</button>
                    )}
                </div>
                <div className="flex flex-col">
                    <input className={"shadow-md w-24 text-sm rounded-full text-white p-1 bg-black " + css.input} placeholder={"Bal: " + farmBalance} value={withdrawAmount} onChange={event => setWithdrawAmount(event.target.value)} />
                    <button className={"shadow-md w-24 text-sm text-black rounded-full px-2 my-2 " + css.button} onClick={handleWithdraw}>Withdraw</button>
                </div>
                <button className={"shadow-md text-sm text-black rounded-full p-1 my-4 " + css.button} onClick={handleClaim}>Claim</button>
                {
                    /*<input className={"shadow-md w-24 text-sm rounded-full text-white bg-black p-2 " + css.input} placeholder={"Bal: " + balance} value={depositAmount} onChange={event => setDepositAmount(event.target.value)} />
                {approval.lt(balanceRaw) || approval.eq(0) ? (
                    <button className={"shadow-md text-sm text-black rounded-full p-2 " + css.button} onClick={() => approve(address, lpTokenAddress)}>Approve</button>
                ) : (
                    <>
                        <button className={"shadow-md text-sm text-black rounded-full p-2 " + css.button} onClick={handleDeposit}>Deposit</button>
                        <button className={"shadow-md text-sm text-black rounded-full p-2 " + css.button} onClick={handleWithdraw}>Withdraw</button>
                        <button className={"shadow-md text-sm text-black rounded-full p-2 " + css.button} onClick={handleClaim}>Claim</button>
                    </>
                )}*/}
            </div>
        </div>
    )
}

export default function Home() {
    const mm = useMetamask()

    return (
        <>
        <Header />
        <Body
            mm={mm}
        />
        </>
    )
}
