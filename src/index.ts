import {
  csvToRegionResultsList,
  RegionResults,
  RegionResultValue,
} from "./lib/data/parse";
import { scaleLinear, interpolateHcl, hcl, HCLColor } from "d3";
import * as Comlink from "comlink";

import Chart from "./Chart";
import { createProabilityColorScale } from "./helpers/general";
import { addStyle, applyStyles, rem } from "./lib/ui/general";
import { appendParamFixInputs } from "./lib/ui/paramFixInputs";
import { appendParamsSelects, findParam } from "./lib/ui/paramsSelects";
import ProbabilitySamplingChart from "./ProbabilitySamplingChart";
import RegionsChart from "./RegionsChart";
import {
  FixationChangeHandler,
  ParamsChangeHandler,
  RegionDatum,
} from "./types/general";
import { fetchCSV } from "./lib/data/utils";
import DataWorker from "web-worker:./lib/data/dataStreamWorker.ts";
import { DataStreamWorker } from "./lib/data/dataStreamWorker";
import { addLoadingOverlay } from "./lib/ui/loadingOverlay";

if (typeof window !== "undefined") {
  (window as any).Chart = Chart;
}

/**
 * TEMP: For demo purposes
 */
const COLOR_MAPPING: Record<RegionResultValue, string> = {
  true: "#f0c928",
  false: "#ab0d0c",
  unknown: "#fbe6c2",
  partially_sat: "#ffdc4f",
  partially_violated: "#fbe6c2",
  center_sat: "#e0c141",
  center_violated: "#fbe6c2",
};

const color = (d: RegionDatum<RegionResultValue>) => COLOR_MAPPING[d.value];

const createRegionsChart = (
  data: RegionDatum<RegionResultValue>[],
  container: HTMLElement
) => {
  container.classList.add("regions-chart");

  addStyle(
    `
    .regions-chart {
      display: flex;
      flex-direction: column-reverse;
      padding: 1rem;
      width: 800px;
    }
  `,
    "regions-chart-styles"
  );

  const params = ["p", "q", "r"];
  const paramsFix = { r: 0.2 };

  let handleParamsChange: ParamsChangeHandler | undefined;
  let handleFixationChange: FixationChangeHandler | undefined;

  const leftMargin = 40;

  const chart = new RegionsChart(container, {
    options: {
      color,
      margin: { top: 20, right: 30, bottom: 30, left: leftMargin },
      params: { x: params[0], y: params[1] },
      handleParamsChange: (...args) => handleParamsChange?.(...args),
      handleFixationChange: (...args) => handleFixationChange?.(...args),
    },
    data,
    width: 800,
    height: 800,
  });

  const controls = document.createElement("div");
  controls.classList.add("chart-controls");
  applyStyles(controls, {});

  addStyle(
    `
    .chart-controls {
      display: flex;
      margin-left: ${rem(leftMargin)};
    }

    .chart-controls > * + * {
      margin-left: 2rem;
    }
  `,
    "styled-chart-controls"
  );

  handleParamsChange = appendParamsSelects(
    controls,
    params,
    chart.x,
    params[0],
    chart.y,
    params[1]
  );

  handleFixationChange = appendParamFixInputs(
    controls,
    paramsFix,
    chart.fixate
  );

  container.appendChild(controls);

  return chart;
};

document.addEventListener("DOMContentLoaded", async (e) => {
  addStyle(
    (theme) => `
    body {
      --doc-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      font-family: ${theme.font};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `,
    "main"
  );

  const container = document.createElement("div");
  document.body.appendChild(container);

  // fetchCSV(
  //   "/csv/regions/large-results/parametric-die01.csv",
  //   csvToRegionResultsList
  // ).then((d) => {
  //   console.log(d);
  //   createRegionsChart(d);
  // });

  const chart = createRegionsChart([], container);

  const dataWorker = new DataWorker();
  const proxy = Comlink.wrap<DataStreamWorker>(dataWorker);

  const data: RegionResults<RegionResultValue> = [];

  const loadingOverlay = addLoadingOverlay(container);

  const finalData = await proxy.streamData(
    document.location.origin +
      "/csv/regions/large-results/parametric-die01.csv",
    Comlink.proxy((values) => {
      const parsed = csvToRegionResultsList(values);
      Array.prototype.push.apply(data, parsed);
      chart.data(data);
    })
  );

  console.log(csvToRegionResultsList(finalData));

  chart.data(csvToRegionResultsList(finalData));

  chart.bindDataToChartArea();

  loadingOverlay.remove();

  proxy[Comlink.releaseProxy]();

  // const right = document.createElement("div");
  // right.style.position = "absolute";
  // right.style.right = "0px";
  // right.style.width = "300px";

  // document.body.appendChild(right);

  // const chart2 = new RegionsChart(right, {
  //   options: { color, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
  //   data: RegionResults01Parsed!,
  //   width: 300,
  //   height: 200,
  // });

  // const under = document.createElement("div");
  // under.style.position = "absolute";
  // under.style.top = "1000px";
  // under.style.width = "800px";

  // document.body.appendChild(under);

  // const colorScale = createProabilityColorScale(["#b30e17", "#f4c941"]);

  // new ProbabilitySamplingChart(under, {
  //   options: {
  //     color: ({ value }) => {
  //       return typeof value === "number" ? colorScale(value) : "#fde6c4";
  //     },
  //     margin: { top: 20, right: 30, bottom: 30, left: 40 },
  //   },
  //   expression: "(-1 * ((p+(-1)) * (q*r+(-1)*r+(-1)*q+1)))/(q*r+(-1)*r+1)",
  //   // "(-1 * ((pK)^8 * (pL)^8 * (pK^2*pL^2+(-3)*pK*pL+3)^8 * (pK^165*pL^165+(-165)*pK^164*pL^164+13530*pK^163*pL^163+(-957965778)*pK^160*pL^160+25526628765*pK^159*pL^159+(-198806807911140)*pK^156*pL^156+3093002977314393*pK^155*pL^155+(-6500829038494138425)*pK^152*pL^152+70164959068962190125*pK^151*pL^151+(-56660283706750323917625)*pK^148*pL^148+461057559789725181152100*pK^147*pL^147+(-172835304869370691143495900)*pK^144*pL^144+1113062073235988177133324675*pK^143*pL^143+(-217656636827698168342673807376)*pK^140*pL^140+1144726269473313408938689574865*pK^139*pL^139+(-126229517314153189252393041300105)*pK^136*pL^136+553985071287148672296051872886633*pK^135*pL^135+(-36379903388569597830001879399422510)*pK^132*pL^132+135292283652045641205026029633435890*pK^131*pL^131+(-5502789884827723146650631325894858650)*pK^128*pL^128+17534631304805857273600331960320823700*pK^127*pL^127+(-454477428573307019031037168111756830750)*pK^124*pL^124+1250893578621891333121339237247701540350*pK^123*pL^123+(-21086352079485828881089958411194659387510)*pK^120*pL^120+50415955017476059028860067289154455565200*pK^119*pL^119+(-560538230083728932284627184195446158183225)*pK^116*pL^116+1168576985409487404176173385338971250188780*pK^115*pL^115+(-8644139130234861468303504579239422901138100)*pK^112*pL^112+15745773024031603273300469057267307642986475*pK^111*pL^111+(-77797252172113753214731541213154806110242900)*pK^108*pL^108+123890727183563390888545495078499701341896025*pK^107*pL^107+(-408632369731038391635493217278480249315571025)*pK^104*pL^104+568374975209953626335203902977304154543560525*pK^103*pL^103+(-1245128003941558709599480954222633442173077990)*pK^100*pL^100+1508919687299888696263527948299332473963703350*pK^99*pL^99+(-2173751452065841699507860812926321457015496750)*pK^96*pL^96+2285540254069036360908106798387848199038481440*pK^95*pL^95+(-2131893548044210182232006300436904500768879850)*pK^92*pL^92+1932732634030151278507630553031626990790249750*pK^91*pL^91+(-1141639916806363638748446026015306906486398590)*pK^88*pL^88+884649780771124823226707804845988654016366300*pK^87*pL^87+(-320858496587309843714231138169766902899674545)*pK^84*pL^84+209972060115440005046844698396319241213782600*pK^83*pL^83+(-44813571364368647853504478042860322826331024)*pK^80*pL^80+24356886671811452178311351539018060943796975*pK^79*pL^79+(-2882405783423761132316762758586363018567100)*pK^76*pL^76+1270831730386530194454202462890250026139305*pK^75*pL^75+(-76539641569102722249568461706874112668625)*pK^72*pL^72+26438808507526838805123756270310051691925*pK^71*pL^71+(-711314141908810072556291545989569505825)*pK^68*pL^68+182221659514356110094113923093175294100*pK^67*pL^67+(-1762012436282075130785825037247749060)*pK^64*pL^64+303659055994684019079576749379065595*pK^63*pL^63+(-687721704303859989462605646538722)*pK^60*pL^60+64102234831356255400596958649685*pK^59*pL^59+174449211009120179071170507*pK^55*pL^55+(-9594706605501609848914377885)*pK^56*pL^56+262255313883710669203659662190*pK^57*pL^57+(-4749379769723296875212617053075)*pK^58*pL^58+6108505140983486749547451366537495*pK^61*pL^61+(-46198144508403707194145187798456075)*pK^62*pL^62+9137697997279471266485356119228468699*pK^65*pL^65+(-42774317748400551793481557722965634225)*pK^66*pL^66+2559126297926594474555140458519450870375*pK^69*pL^69+(-8528222364669459942405390141308459980470)*pK^70*pL^70+207606798862689503409859957851718401912300*pK^73*pL^73+(-529167391924299790310602144917193598078025)*pK^74*pL^74+6187579479454717469654363985392901973430025*pK^77*pL^77+(-12595717147691764786550346667653385565536875)*pK^78*pL^78+78562995853448246078848452002730542250465795*pK^81*pL^81+(-131409064261991758967996246393588698963316805)*pK^82*pL^82+469385240703069424706125489397111068952275419*pK^85*pL^85+(-657993884691422625739915418242305906519293490)*pK^86*pL^86+1415205072640860160481182808774484027856655670*pK^89*pL^89+(-1686325649242516098037570104342582148137352368)*pK^90*pL^90+2264425144847531091667482466209940704912263100*pK^93*pL^93+(-2317212917901294264769043296654709440227808950)*pK^94*pL^94+1994328402949189655896012936746467262915433050*pK^97*pL^97+(-1765640758973344758496022485465336463471094300)*pK^98*pL^98+992337242608981269865052704452427148889831600*pK^101*pL^101+(-764017204302438371704416205990685863555145550)*pK^102*pL^102+283964207454505439214810132637370013795873540*pK^105*pL^105+(-190758416113796885477040772833646048465280625)*pK^106*pL^106+47237319072094809819901407171801922928959425*pK^109*pL^109+(-27734274733495565834541830731304422527701355)*pK^110*pL^110+4588545451243088551427610928833322271922075*pK^113*pL^113+(-2355042174244405993543713244859827758830625)*pK^114*pL^114+259887963058963706600459031996938342269575*pK^117*pL^117+(-116448285978118940970037525680641040017550)*pK^118*pL^118+8517895800097595196438708802854874618050*pK^121*pL^121+(-3322364587928565463515277303530093582300)*pK^122*pL^122+159283230009716862818060413827188941920*pK^125*pL^125+(-53830184136471027950515517701213744950)*pK^126*pL^126+1662906918026691560710263616639049250*pK^129*pL^129+(-483633472938241499847059257376373168)*pK^130*pL^130+9396854788563924547823764816986900*pK^133*pL^133+(-2329763001737915335823722564594290)*pK^134*pL^134+27535161740286631736564629939800*pK^137*pL^137+(-5744208438342270352038807922005)*pK^138*pL^138+39433277875245401091338318925*pK^141*pL^141+(-6797398767412382785717936875)*pK^142*pL^142+25400609313021960741839115*pK^145*pL^145+(-3525558331096991341100025)*pK^146*pL^146+6523984871083391255775*pK^149*pL^149+(-701468747712276244470)*pK^150*pL^150+555118939167378300*pK^153*pL^153+(-43435805884956225)*pK^154*pL^154+11420556475185*pK^157*pL^157+(-579167664075)*pK^158*pL^158+29763855*pK^161*pL^161+(-735075)*pK^162*pL^162+(-1))))/(1)",
  //   // "(-1 * (pK^10*pL^10+(-120)*pK^7*pL^7+(-10)*pK^9*pL^9+45*pK^8*pL^8+210*pK^6*pL^6+(-250)*pK^5*pL^5+(-100)*pK^3*pL^3+25*pK^2*pL^2+200*pK^4*pL^4+(-1)))/(1)",
  //   intervals: [
  //     // { name: "pL", start: 0, end: 1 },
  //     // { name: "pK", start: 0, end: 1 },
  //     { name: "p", start: 0, end: 1 },
  //     { name: "q", start: 0, end: 0.5 },
  //     { name: "r", start: 1 / 10, end: 3 / 10 },
  //   ],
  //   width: 800,
  //   height: 800,
  // });
});

export default Chart;
