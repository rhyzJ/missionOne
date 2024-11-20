import styles from "./CalculatePrem.module.css";

const CalculatePrem = ({ carResult }) => {
  const premCost = () => {
    switch (carResult) {
      case "Hatchback":
        return {
          text: "Your premium is estimated at: ",
          cost: "$485.65 per year",
        };
      case "Sports Car":
        return {
          text: "Your premium is estimated at: ",
          cost: "$934.92 per year",
        };
      case "SUV":
        return {
          text: "Your premium is estimated at: ",
          cost: "$619.31 per year",
        };
      case "Sedan":
        return {
          text: "Your premium is estimated at: ",
          cost: "$460.20 per year",
        };
      case "Truck":
        return {
          text: "Your premium is estimated at: ",
          cost: "$739.29 per year",
        };
      default:
        return true;
    }
  };

  const result = premCost();

  if (!result) {
    //if result is not true (usually form an error during img upload), return ui
    return (
      <div className={styles.result}>No premium information available</div>
    );
  }

  return (
    <div className={styles.result}>
      {result.text}
      <span className={styles.cost}>{result.cost}</span>
    </div>
  );
};

export default CalculatePrem;
