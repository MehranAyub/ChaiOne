import styles from "./view-score.module.scss";
import styled from "styled-components";
// import "./score.css";

const OverallScore = (props) => {
  const Circle = styled.div`
    margin: 50px auto;
    width: 256px;
    height: 256px;
    background: #fefcff;
    border-radius: 100%;
    border: 1px solid var(--pale-grey);
    align-items: center;
    & .circle .mask,
    .circle .fill {
      width: 256px;
      height: 256px;
      position: absolute;
      border-radius: 50%;
    }
    & .circle .mask,
    .circle .fill {
      width: 256px;
      height: 256px;
      position: absolute;
      border-radius: 50%;
    }
    & .mask .fill {
      clip: rect(0px, 128px, 256px, 0px);
      background-color: #fca557;
    }
    & .circle .mask {
      clip: rect(0px, 256px, 256px, 128px);
    }

    .mask.full,
    .circle .fill {
      animation: fill ease-in-out 3s;
      transform:  rotate(${props.percent});
    }
    & .inside-circle {
      width: 248px;
      height: 248px;
      border-radius: 100%;
      background: #fff;
      line-height: 120px;
      text-align: center;
      margin-top: 4px;
      margin-left: 4px;
      color: #1e51dc;
      position: absolute;
      z-index: 100;
      font-weight: 700;
      font-size: 2em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    h4 {
      font-size: 64px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 0.88;
      letter-spacing: 2.74px;
      text-align: center;
      color: var(--gunmetal);
    }
    h5 {
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: 1.4px;
      text-align: center;
      color: var(--fill-grey);
      margin-top: 16px;
    }
    @keyframes fill{
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(${props.percent});
      }
  `;
  return (
    <div className={styles.overallScore}>
      <h3>Overall Score</h3>
      <Circle>
        <div className="circle">
          <div className="mask half">
            <div className="fill"></div>
          </div>
          <div className="mask full">
            <div className="fill"></div>
          </div>
          <div className="inside-circle">
            <h4>40.25</h4>
            <h5>OUT OF 100</h5>
          </div>
        </div>
      </Circle>
      <p>Below Average</p>
    </div>
  );
};

export default OverallScore;
