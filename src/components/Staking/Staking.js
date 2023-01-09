import React, { Fragment } from "react";

// import { Button } from "@cubitrix/cubitrix-react-ui-module";
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

const stakeFakeData = [
  {
      id: 1,
      amount: '1,220,000.2',
      stakeDate: '01.02.2023 10:00AM',
      unstakeDate: '01.02.2023 08:15PM',
      reward: 'CML',
      harvest: '1,132,000.1',
  }, {
    id: 2,
    amount: '1,220,000.2',
    stakeDate: '01.02.2023 10:00AM',
    unstakeDate: '01.02.2023 08:15PM',
    reward: 'CML',
    harvest: '1,132,000.1',
  }, {
    id: 3,
    amount: '1,220,000,000.2',
    stakeDate: '01.02.2023 10:00AM',
    unstakeDate: '01.02.2023 08:15PM',
    reward: 'CML',
    harvest: '1,132,000.1',
  }, 
]

export const Staking = (props) => {
  return (
    <div className='staking-container'>
      <div className="staking-left">
        <div className="staking-left__info-container">
          <div className="staking-left__info">
            <h2 className="font-16">Staked</h2>
            <p className="font-14">Bidding Balance <span>0</span></p>
            <p className="font-14">Bidding Stakers <span>0</span></p>
          </div>
        </div>
        <h2 className="font-14 staking-left__header">Staking Calculator</h2>
        <p className="staking-left__input">
          <label>Amount</label>
          <input type='text' placeholder="0.0000"/>
          <span className="font-12">MAX</span>
        </p>
        <ul className="staking-left__list">
          <li className="active">30 D</li>
          <li>60 D</li>
          <li>90 D</li>
          <li>100 D</li>
          <li>360 D</li>
        </ul>
        <div className="staking-left__help">
          <InfoCircleIcon />
          <p className="font-10">15 % APY On 30 Days. Locked Until 02/02/2023 2:33 PM</p>
        </div>
        <button className="staking-left__btn">Stake</button>
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
                  <p>1,220.2 CML</p>
              </div>
              <div className="staking-right__info-element">
                  <p className="font-16">
                    <EarnIcon />
                    Earn
                  </p>
                  <p >1,020 CML</p>
              </div>
              <div className="staking-right__info-element">
                  <p>
                    <RewardIcon />
                    Claimed Reward
                  </p>
                  <p>1,132.1 CML</p>
              </div>
          </div>
          <div className="staking-right__info-item">
              <div className="staking-right__info-element font-16">
                  <p>
                    <WalletMoneyIcon />
                    Your Wallet Balance
                  </p>
                  <p>1,220.2 CML</p>
              </div>
              <div className="staking-right__info-element">
                  <p className="font-16">
                    <TotalStakedIcon />
                    Total Staked
                  </p>
                  <p >1,020 CML</p>
              </div>
              <div className="staking-right__info-element">
                  <p>
                    <TotalUnstakedIcon />
                    Total Unstaked
                  </p>
                  <p>1,132.1 CML</p>
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
             {stakeFakeData.map(item => (
                <tr className="staking-right__stakes-content">
                  <td>{item.amount}</td>
                  <td>{item.stakeDate}</td>
                  <td>{item.unstakeDate}</td>
                  <td>{item.reward}</td>
                  <td>{item.harvest}</td>
                  <button className="unstake-btn font-14">Unstake</button>
                  <button className="harvest-btn font-14">Harvest</button>
                </tr>
              ))}
          </table>
      </div>
    </div>
  );
};
