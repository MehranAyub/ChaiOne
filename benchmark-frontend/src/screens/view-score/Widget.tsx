import styles from './view-score.module.scss';

const Widget = (props: any) => {
  return (
    <div className={styles.widget}>
      <h3>{props.title}</h3>
      {props.children}
    </div>
  );
};
export default Widget;