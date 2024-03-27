import { retrieveDBdataAsync } from "./retrieveDBdataAsync";
import { FARMER_TREE_WEIGHT_RATIO } from "@env";

export const validateTransaction = async ({
  farmerid,
  kgsGood,
  kgsBad,
  setValid,
  setCurrentJob,
  setError,
}) => {
  try {
    let maxWeight = 0;
    let trees = 0;
    let weight1 = parseFloat(kgsBad) || 0;
    let weight2 = parseFloat(kgsGood) || 0;
    let transactionWeightTotal = weight1 + weight2;

    retrieveDBdataAsync({
      filterValue: farmerid,
      tableName: "rtc_households",
    })
      .then((result) => {
        trees = parseInt(result.Trees);
        maxWeight = trees * FARMER_TREE_WEIGHT_RATIO;
        if (transactionWeightTotal <= maxWeight) {
          setValid(true);
        } else {
          setValid(false);
          setCurrentJob("Maximum weight allowed exceeded");
          setError({
            message: `Maximum weight of ${maxWeight} Kg(s) has exceeded`,
            type: "weight",
          });
        }
      })
      .catch((error) => {
        console.log("Failed to retrieve household: ", error);
      });
  } catch (error) {
    console.log(error);
  }
};
