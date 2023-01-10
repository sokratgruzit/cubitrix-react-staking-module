import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './Staking.css';
import '../../assets/css/main-theme.css';
import { 
  InfoCircleIcon,
  CurrentStakeIcon,
  EarnIcon,
  RewardIcon,
  WalletMoneyIcon,
  TotalStakedIcon,
  TotalUnstakedIcon
} from '../../assets/svgs/index';

import STACK_ABI from "./stack.json";
import WBNB from ".BNB.json";
import moment from "moment";

// const stakeFakeData = [
//   {
//       id: 1,
//       amount: '1,220,000.2',
//       stakeDate: '01.02.2023 10:00AM',
//       unstakeDate: '01.02.2023 08:15PM',
//       reward: 'CML',
//       harvest: '1,132,000.1',
//   }, {
//     id: 2,
//     amount: '1,220,000.2',
//     stakeDate: '01.02.2023 10:00AM',
//     unstakeDate: '01.02.2023 08:15PM',
//     reward: 'CML',
//     harvest: '1,132,000.1',
//   }, {
//     id: 3,
//     amount: '1,220,000,000.2',
//     stakeDate: '01.02.2023 10:00AM',
//     unstakeDate: '01.02.2023 08:15PM',
//     reward: 'CML',
//     harvest: '1,132,000.1',
//   }, 
// ]

const BUTTONS_DATA = [
  {
    title: "30 D",
    time: 0,
    period: 30,
  },
  {
    title: "60 D",
    time: 1,
    period: 60,
  },
  {
    title: "90 D",
    time: 2,
    period: 90,
  },
  {
    title: "180 Day",
    time: 3,
    period: 180,
  },
  {
    title: "360 D",
    time: 4,
    period: 360,
  },
];

export const Staking = ({ useConnect, name }) => {
  const { active: isActive, account, library } = useConnect();
  console.log(name)

  var web3Obj = library;

  var Router = "0x61d27DFd33718E47FBcFBf31B8e96439D3eccbdD"; // Staking contract Address
  var tokenAddress = "0xb2343143f814639c9b1f42961C698247171dF34a"; // Staking Token Address

  const [depositAmount, setDepositAmount] = useState("");
  const [timeperiod, setTimeperiod] = useState(0);
  const [timeperiodDate, setTimeperiodDate] = useState(
    moment().add(30, "days").format("DD/MM/YYYY h:mm A"),
  );

  const [balance, setBalance] = useState(0);

  const [stackContractInfo, setStackContractInfo] = useState({
    totalStakers: 0,
    totalStakedToken: 0,
  });
  const [stakersInfo, setStakersInfo] = useState({
    totalStakedTokenUser: 0,
    totalUnstakedTokenUser: 0,
    totalClaimedRewardTokenUser: 0,
    currentStaked: 0,
    realtimeReward: 0,
    stakeCount: 0,
    alreadyExists: false,
  });
  const [stakersRecord, setStakersRecord] = useState([]);

  const [isAllowance, setIsAllowance] = useState(false);
  const [loading, setLoadding] = useState(false);

  const notify = (isError, msg) => {
    if (isError) {
      toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success(msg, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const checkAllowance = async () => {
    try {
      setLoadding(true);

      var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      var decimals = await tokenContract.methods.decimals().call();
      var getBalance = await tokenContract.methods.balanceOf(account).call();

      var pow = 10 ** decimals;
      var balanceInEth = getBalance / pow;
      setBalance(balanceInEth);
      var allowance = await tokenContract.methods.allowance(account, Router).call();

      if (allowance <= 2) {
        setIsAllowance(true);
      }
      if (depositAmount > 0) {
        var amount = depositAmount * pow;
        if (allowance < amount) {
          setIsAllowance(true);
        }
      }
      setLoadding(false);
    } catch (err) {
      setLoadding(false);
    }
  };

  const approve = async () => {
    setLoadding(true);
    try {
      var contract = new web3Obj.eth.Contract(WBNB, tokenAddress);

      var amountIn = 10 ** 69;
      amountIn = amountIn.toLocaleString("fullwide", { useGrouping: false });
      //   var amountIn = new web3Obj.utils.BigNumber("10").pow(69);

      await contract.methods
        .approve(Router, amountIn.toString())
        .send({ from: account })
        .then(() => {
          setIsAllowance(false);
          // checkAllowance("0xaae3d23a76920c9064aefdd571360289fcc80053");
          setLoadding(false);
        });
    } catch (err) {
      console.log(err);
      setLoadding(false);
      notify(true, err.message);
    }
  };

  const stake = async () => {
    if (isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      notify(true, "Error! please enter amount");
      return;
    }
    await checkAllowance();
    setLoadding(true);
    try {
      var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      const decimals = await tokenContract.methods.decimals().call();

      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);

      var pow = 10 ** decimals;
      var amountIn = depositAmount * pow;
      // var amountInNew = `${new ethers.utils.BigNumber(amountIn.toString())}`;
      amountIn = amountIn.toLocaleString("fullwide", { useGrouping: false });

      await contract.methods
        .stake(amountIn.toString(), timeperiod.toString())
        .send({ from: account })
        .then((err) => {
          getStackerInfo();
          setLoadding(false);
          notify(false, "Staking process complete.");
        });
    } catch (err) {
      setLoadding(false);
      notify(true, err.message);
    }
  };

  const unstake = async (index) => {
    setLoadding(true);
    try {
      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      await contract.methods
        .unstake(index.toString())
        .send({ from: account })
        .then((result) => {
          getStackerInfo();
          setLoadding(false);
          notify(false, "successfully unstake");
          //   withdrawModal();
        });
    } catch (err) {
      setLoadding(false);
      notify(true, "unstake fail");
    }
  };

  const harvest = async (index) => {
    setLoadding(true);
    try {
      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      await contract.methods
        .harvest(index.toString())
        .send({ from: account })
        .then((err) => {
          getStackerInfo();
          setLoadding(false);
          checkAllowance();
          notify(false, "Reward successfully harvested");
        });
    } catch (err) {
      console.log(err);
      setLoadding(false);
      notify(true, err.message);
    }
  };

  const getStackerInfo = async () => {
    setLoadding(true);
    try {
      var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
      var decimals = await tokenContract.methods.decimals().call();
      var getBalance = await tokenContract.methods.balanceOf(account.toString()).call();
      var pow = 10 ** decimals;
      var balanceInEth = getBalance / pow;
      console.log(getBalance);
      console.log(balanceInEth);
      setBalance(balanceInEth);

      var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
      var totalStakedToken = await contract.methods.totalStakedToken.call().call();
      var totalStakers = await contract.methods.totalStakers.call().call();
      var realtimeReward = await contract.methods.realtimeReward(account).call();
      var Stakers = await contract.methods.Stakers(account).call();

      var totalStakedTokenUser = Stakers.totalStakedTokenUser / pow;
      var totalUnstakedTokenUser = Stakers.totalUnstakedTokenUser / pow;
      var currentStaked = totalStakedTokenUser - totalUnstakedTokenUser;
      totalStakedToken = totalStakedToken / pow;

      Stakers.totalStakedTokenUser = totalStakedTokenUser;
      Stakers.totalUnstakedTokenUser = totalUnstakedTokenUser;
      Stakers.currentStaked = currentStaked;
      Stakers.realtimeReward = realtimeReward / pow;
      Stakers.totalClaimedRewardTokenUser = Stakers.totalClaimedRewardTokenUser / pow;
      var stakersRecord = [];
      for (var i = 0; i < parseInt(Stakers.stakeCount); i++) {
        var stakersRecordData = await contract.methods.stakersRecord(account, i).call();

        var realtimeRewardPerBlock = await contract.methods
          .realtimeRewardPerBlock(account, i.toString())
          .call();

        stakersRecordData.realtimeRewardPerBlock = realtimeRewardPerBlock[0] / pow;

        stakersRecordData.unstaketime = moment
          .unix(stakersRecordData.unstaketime)
          .format("DD/MM/YYYY h:mm A");
        stakersRecordData.staketime = moment
          .unix(stakersRecordData.staketime)
          .format("DD/MM/YYYY h:mm A");
        stakersRecord.push(stakersRecordData);
      }
      setStakersInfo(Stakers);
      setStakersRecord(stakersRecord);
      setStackContractInfo({
        totalStakers: totalStakers,
        totalStakedToken: totalStakedToken,
      });
      setLoadding(false);
    } catch (err) {
      // console.log(err);
      setLoadding(false);
      setStakersInfo({
        totalStakedTokenUser: 0,
        totalUnstakedTokenUser: 0,
        totalClaimedRewardTokenUser: 0,
        currentStaked: 0,
        realtimeReward: 0,
        stakeCount: 0,
        alreadyExists: false,
      });
      setStackContractInfo({
        totalStakers: 0,
        totalStakedToken: 0,
      });
      setStakersRecord([]);
      setBalance(0);
    }
  };

  const setMaxWithdrawal = async () => {
    var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
    var decimals = await tokenContract.methods.decimals().call();
    var getBalance = await tokenContract.methods.balanceOf(account.toString()).call();
    var pow = 10 ** decimals;
    var balanceInEth = getBalance / pow;
    setDepositAmount(balanceInEth.toFixed(5));
    // setWithdrawAmount(userInfo.staked);
  };

  useEffect(() => {
    if (isActive) {
      checkAllowance();
      getStackerInfo();
    }
  }, [isActive, account]);

  return (
    <>
      <div className='staking-container'>
        <div className="staking-left">
          <div className="staking-left__info-container">
            <div className="staking-left__info">
              <h2 className="font-16">Staked</h2>
              <p className="font-14">Bidding Balance <span>{stackContractInfo.totalStakedToken}</span></p>
              <p className="font-14">Bidding Stakers <span>{stackContractInfo.totalStakers}</span></p>
            </div>
          </div>
          <h2 className="font-14 staking-left__header">Staking Calculator</h2>
          <form className="staking-left__input">
            <label>Amount</label>
            <input 
              type='text'
              placeholder="0.0000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button 
              className="font-12"
              onClick={() => setMaxWithdrawal()}
            >
              MAX
            </button>
          </form>
          <ul className="staking-left__list">
            {BUTTONS_DATA.map((btn) => {
              return (
                <li
                  key={btn.period}
                  onClick={async () => {
                    setTimeperiod(btn.time);
                    setTimeperiodDate(
                      moment()
                        .add(btn.period, "days")
                        .format("DD/MM/YYYY h:mm A"),
                    )
                  }}
                >
                  {btn.title}
                </li>
              )
            })}
          </ul>
          <div className="staking-left__help">
            <InfoCircleIcon />
            <p className="font-10">15 % APY On 30 Days. Locked Until 02/02/2023 2:33 PM</p>
          </div>
          <button 
            className="staking-left__btn"
            onClick={stake}
          >
            Stake
          </button>
        </div>
        <div className="staking-right">
          <h2 className="staking-right__header">Your Stake</h2>
          <div className="staking-right__info">
            <div className="staking-right__info-item">
                <div className="staking-right__info-element font-16">
                    <p>
                      <CurrentStakeIcon />
                      Current Stake
                    </p>
                    <p>
                      {parseFloat(stakersInfo.currentStaked).toFixed(5)} CMCX
                    </p>
                </div>
                <div className="staking-right__info-element">
                    <p className="font-16">
                      <EarnIcon />
                      Earn
                    </p>
                    <p>
                      {parseFloat(stakersInfo.realtimeReward).toFixed(10)} CMCX
                    </p>
                </div>
                <div className="staking-right__info-element">
                    <p>
                      <RewardIcon />
                      Claimed Reward
                    </p>
                    <p>
                      {parseFloat(stakersInfo.totalClaimedRewardTokenUser).toFixed(5)} MCX
                    </p>
                </div>
            </div>
            <div className="staking-right__info-item">
                <div className="staking-right__info-element font-16">
                    <p>
                      <WalletMoneyIcon />
                      Your Wallet Balance
                    </p>
                    <p>{balance.toFixed(5)} CML</p>
                </div>
                <div className="staking-right__info-element">
                    <p className="font-16">
                      <TotalStakedIcon />
                      Total Staked
                    </p>
                    <p>
                      {parseFloat(stakersInfo.totalStakedTokenUser).toFixed(5)} CMCX
                    </p>
                </div>
                <div className="staking-right__info-element">
                    <p>
                      <TotalUnstakedIcon />
                      Total Unstaked
                    </p>
                    <p>
                      {parseFloat(stakersInfo.totalUnstakedTokenUser).toFixed(5)} CMCX
                    </p>
                </div>
            </div>
          </div>
          <table className="staking-right__stakes">
                <tr className="staking-right__stakes-head font-14">
                  <th>Staked Amount</th>
                  <th>Stake Date</th>
                  <th>Unstake Date</th>
                  <th>Earn Reward</th>
                  <th>Harvest</th>
                </tr>
                  {stakersRecord.length > 0 ? (
                    stakersRecord.map((row, index) => {
                      return (
                        <tr key={index} className="staking-right__stakes-content">
                          <td>
                            {parseFloat(row.amount) / 10 ** 18}
                          </td>
                          <td>{row.staketime}</td>
                          <td>{row.unstaketime}</td>
                          <td>CMCX</td>
                          <td>{item.harvest}</td>
                          {row.unstaked ? (
                            <button
                              disabled={true}
                              className="unstake-btn font-14 disabled"
                            >
                              Unstaked
                            </button>
                          ) : (
                            <button 
                              disabled={loading}
                              className="unstake-btn font-14"
                              onClick={() => unstake(index)}
                            >
                              Unstake
                              </button>

                          )}
                          {row.withdrawan ? (
                            <button
                              disabled={true}
                              className="harvest-btn font-14 disabled"
                            >
                              Harversted
                            </button>
                          ) : (
                            <button
                              disabled={loading}
                              onClick={() => harvest(index)}
                              className="harvest-btn font-14"
                            >
                              Harverst
                            </button>
                          )}
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        You have no stake record yet.
                      </td>
                    </tr>
                  )}
            </table>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
