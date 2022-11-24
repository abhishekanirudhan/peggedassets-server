import { wrapScheduledLambda } from "./utils/shared/wrap";
import { store } from "./utils/s3";
import { craftChartsResponse } from "./getStablecoinChart";
import peggedData from "./peggedData/peggedData";

const handler = async (_event: any) => {
  await Promise.all(
    peggedData.map(async (pegged) => {
      const id = pegged.id;
      const chart = await craftChartsResponse("all", id, undefined, false);
      const filename = `charts/all/${id}`;
      await store(filename, JSON.stringify(chart), true, false);
    })
  );

  const allChart = await craftChartsResponse("all", undefined, undefined, false);
  await store("charts/all/all", JSON.stringify(allChart), true, false);
};

export default wrapScheduledLambda(handler);
