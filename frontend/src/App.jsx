import axios from "axios"
import { useEffect, useState, useMemo } from "react"

import MapView from "./components/MapView"
import AIChat from "./components/AIChat"
import OceanQueryBox from "./components/OceanQueryBox"
import FisheriesMap from "./components/FisheriesMap"
import OceanGlobe from "./components/OceanGlobe"
import FisheriesAnalytics from "./components/FisheriesAnalytics"
import BiodiversityDashboard from "./components/BiodiversityDashboard"
import api from "./api";
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
BarChart,
Bar,
PieChart,
Pie,
Cell,
CartesianGrid
} from "recharts"

function App(){

const [view,setView] = useState("dashboard")

const [stats,setStats] = useState(null)
const [oceanData,setOceanData] = useState([])
const [mode,setMode] = useState("temperature")

/* intelligence counts */

const [oceanCount,setOceanCount] = useState(0)
const [fisheriesCount,setFisheriesCount] = useState(0)
const [biodiversityCount,setBiodiversityCount] = useState(0)
const [countries,setCountries] = useState(0)
const [effort,setEffort] = useState(0)


/* ================= FETCH DATA ================= */

useEffect(() => {
  api.get("/ocean/stats")
    .then(res => {
      setStats(res.data);
      setOceanCount(res.data.total_records);
    })
    .catch(err => console.log("Stats error:", err));
}, []);

useEffect(() => {
  api.get("/ocean/?min_lat=-40&max_lat=30&min_lon=20&max_lon=120&limit=5000")
    .then(res => setOceanData(res.data));
}, []);

/* fisheries records */

useEffect(() => {
  api.get("/fisheries/fisheries/total-records")
    .then(res => setFisheriesCount(res.data.total));
}, []);

/* biodiversity records */

useEffect(() => {
  api.get("/biodiversity/biodiversity/total-records")
    .then(res => setBiodiversityCount(res.data.total));
}, []);

useEffect(() => {
  api.get("/fisheries/fisheries/countries-count")
    .then(res => setCountries(res.data.count));
}, []);

useEffect(() => {
  api.get("/fisheries/fisheries/total-effort")
    .then(res => setEffort(res.data.effort));
}, []);

/* ================= TOTAL PLATFORM RECORDS ================= */

const totalPlatformRecords =
(oceanCount || 0) +
(fisheriesCount || 0) +
(biodiversityCount || 0)

/* ================= KPI CALCULATIONS ================= */

const {avgTemp,maxTemp,avgDepth,totalPoints} = useMemo(()=>{

if(!oceanData.length)
return {avgTemp:0,maxTemp:0,avgDepth:0,totalPoints:0}

const temps = oceanData.map(d=>d.temperature)
const depths = oceanData.map(d=>d.depth)

return{
avgTemp:temps.reduce((a,b)=>a+b,0)/temps.length,
maxTemp:Math.max(...temps),
avgDepth:depths.reduce((a,b)=>a+b,0)/depths.length,
totalPoints:oceanData.length
}

},[oceanData])

/* ================= DASHBOARD CHART DATA ================= */

const activityData = [
{time:"00",value:12},
{time:"04",value:16},
{time:"08",value:28},
{time:"12",value:34},
{time:"16",value:30},
{time:"20",value:22}
]

const fisheriesPreview=[
{country:"China",catch:3200000},
{country:"Indonesia",catch:2400000},
{country:"India",catch:2100000},
{country:"Peru",catch:1800000},
{country:"USA",catch:1500000}
]

const biodiversityPreview=[
{name:"Fish",value:65},
{name:"Corals",value:15},
{name:"Mammals",value:8},
{name:"Crustaceans",value:12}
]

const COLORS=["#22c55e","#3b82f6","#f97316","#eab308"]

return(

<div style={layoutStyle}>

{/* SIDEBAR */}

<div style={sidebarStyle}>

<h2 style={{marginBottom:"40px"}}>🌊 Marine AI</h2>

<NavItem label="Dashboard" onClick={()=>setView("dashboard")}/>
<NavItem label="Ocean Data" onClick={()=>setView("ocean")}/>
<NavItem label="Fisheries Intelligence" onClick={()=>setView("fisheries")}/>
<NavItem label="Biodiversity Intelligence" onClick={()=>setView("biodiversity")}/>
<NavItem label="3D Ocean Globe" onClick={()=>setView("globe")}/>
<NavItem label="AI Assistant" onClick={()=>setView("assistant")}/>

</div>

{/* MAIN CONTENT */}

<div style={contentStyle}>

{/* ================= DASHBOARD ================= */}

{view==="dashboard" && stats && (

<>

<div style={heroSection}>

<div>
<h1 style={heroTitle}>Marine AI Research Dashboard</h1>
<p style={heroSubtitle}>
Enterprise Ocean Intelligence Monitoring Platform
</p>
</div>

<div style={liveBadge}>● LIVE SYSTEM</div>

</div>

{/* KPI CARDS */}

<div style={kpiGrid}>

<KpiCard
title="Total Platform Records"
value={totalPlatformRecords.toLocaleString()}
subtitle="Global Marine Intelligence Data"
/>

<KpiCard
title="Ocean Monitoring Regions"
value={stats.region_count}
subtitle="Global Ocean Zones"
/>

<KpiCard
title="Fishing Nations"
value={countries}
subtitle="Active Fisheries Countries"
/>

<KpiCard
title="Global Fishing Effort"
value={Math.round(effort).toLocaleString()}
subtitle="Total Fishing Hours"
 />

</div>

{/* INTELLIGENCE STRIP */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"25px",
marginBottom:"40px"
}}>

<div style={miniCard}>
<p style={{color:"#94a3b8"}}>Ocean Intelligence</p>
<h2>{oceanCount.toLocaleString()}</h2>
<p style={{color:"#64748b"}}>Ocean Sensor Records</p>
</div>

<div style={miniCard}>
<p style={{color:"#94a3b8"}}>Fisheries Intelligence</p>
<h2>{fisheriesCount.toLocaleString()}</h2>
<p style={{color:"#64748b"}}>Global Catch Records</p>
</div>

<div style={miniCard}>
<p style={{color:"#94a3b8"}}>Biodiversity Intelligence</p>
<h2>{biodiversityCount.toLocaleString()}</h2>
<p style={{color:"#64748b"}}>Marine Species Records</p>
</div>

</div>

{/* MONITORING CHART */}

<div style={cardSurface}>

<h2 style={panelTitle}>Ocean Monitoring Activity</h2>

<div style={{height:"250px"}}>

<ResponsiveContainer width="100%" height="100%">

<LineChart data={activityData}>

<XAxis dataKey="time" stroke="#94a3b8"/>
<YAxis stroke="#94a3b8"/>

<Tooltip
                cursor={{fill:"transparent"}}
                contentStyle={{
                  background:"#020617",
                  border:"1px solid #334155",
                  borderRadius:"8px",
                  color:"white"
                }}/>

<Line
type="monotone"
dataKey="value"
stroke="#38bdf8"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

{/* FISHERIES + BIODIVERSITY PREVIEW */}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"30px",
marginTop:"40px"
}}>

<div style={cardSurface}>

<h2 style={panelTitle}>Global Fisheries Overview</h2>

<ResponsiveContainer width="100%" height={260}>

<BarChart
            data={fisheriesPreview}
            margin={{ top:5, right:5, left:13, bottom:2 }}
            >

<CartesianGrid strokeDasharray="3 3" stroke="#334155"/>

<XAxis dataKey="country" stroke="#cbd5f5"/>
<YAxis stroke="#cbd5f5"/>

<Tooltip
            cursor={{fill:"transparent"}}
            contentStyle={{
            background:"#020617",
            border:"1px solid #334155",
            borderRadius:"8px"
            }}
            formatter={(v)=>Number(v).toLocaleString()}
            />

<Bar dataKey="catch" fill="#3b82f6"/>

</BarChart>

</ResponsiveContainer>

</div>

<div style={cardSurface}>

<h2 style={panelTitle}>Marine Biodiversity Distribution</h2>

<ResponsiveContainer width="100%" height={260}>

<PieChart>

<Pie
data={biodiversityPreview}
dataKey="value"
nameKey="name"
outerRadius={90}
label={({ value }) => (value)} 
>

{biodiversityPreview.map((entry,index)=>(
<Cell key={index} fill={COLORS[index%COLORS.length]}/>
))}

</Pie>

<Tooltip
            contentStyle={{
                background:"#020617",
                border:"1px solid #334155",
                borderRadius:"8px"
            }}
            itemStyle={{color:"white"}}
            />

</PieChart>

</ResponsiveContainer>

</div>
{/* System Status Panel */}
                  <div style={panelStyle}>
                    <h2 style={{ marginBottom: "20px" }}>System Health</h2>

                    <StatusItem label="PostgreSQL Database" status="Operational" />
                    <StatusItem label="AI Engine (Google Gemini)" status="Active" />
                    <StatusItem label="API Gateway" status="Online" />
                    <StatusItem label="Heatmap Engine" status="Rendering" />
                  </div>

</div>

</>

)}

{/* ================= OCEAN ================= */}

{view==="ocean" && (

<>

<h1 style={{marginBottom:"10px"}}>Ocean Data Explorer</h1>

<p style={{color:"#94a3b8",marginBottom:"30px"}}>
Real-time marine geospatial monitoring system.
</p>

<div style={oceanKpiStrip}>

<MiniKPI title="Avg Temp" value={`${avgTemp.toFixed(2)}°C`}/>
<MiniKPI title="Max Temp" value={`${maxTemp.toFixed(2)}°C`}/>
<MiniKPI title="Avg Depth" value={`${avgDepth.toFixed(2)} m`}/>
<MiniKPI title="Total Points" value={totalPoints}/>

</div>

<div style={{marginBottom:"20px"}}>

<button
onClick={()=>setMode("temperature")}
style={mode==="temperature"?activeBtn:normalBtn}
>
🌡 Temperature
</button>

<button
onClick={()=>setMode("depth")}
style={mode==="depth"?activeBtn:normalBtn}
>
🌊 Depth
</button>

</div>

<MapView data={oceanData} mode={mode}/>
<OceanQueryBox/>

</>

)}

{/* FISHERIES */}

{view==="fisheries" &&(
<>
<FisheriesMap/>
<FisheriesAnalytics/>
</>
)}

{/* BIODIVERSITY */}

{view==="biodiversity" &&(
<BiodiversityDashboard/>
)}

{/* GLOBE */}

{view==="globe" &&(
<div style={cardSurface}>
<OceanGlobe/>
</div>
)}

{/* AI */}

{view==="assistant" && <AIChat/>}

</div>

</div>

)

}

/* ================= COMPONENTS ================= */

function NavItem({label,onClick}){

const [hover,setHover]=useState(false)

return(

<div
onClick={onClick}
onMouseEnter={()=>setHover(true)}
onMouseLeave={()=>setHover(false)}
style={{
marginBottom:"15px",
cursor:"pointer",
padding:"10px",
borderRadius:"8px",
background:hover?"rgba(59,130,246,0.2)":"transparent",
color:hover?"white":"#cbd5e1"
}}
>
{label}
</div>

)

}

function KpiCard({title,value,subtitle}){

return(

<div style={cardSurface}>

<h4 style={{color:"#94a3b8",marginBottom:"10px"}}>
{title}
</h4>

<h1 style={{marginBottom:"10px"}}>
{value}
</h1>

<p style={{color:"#64748b"}}>
{subtitle}
</p>

</div>

)

}

function MiniKPI({title,value}){

return(

<div style={miniCard}>
<div style={{fontSize:"12px",color:"#94a3b8"}}>{title}</div>
<div style={{fontSize:"18px",fontWeight:"600"}}>{value}</div>
</div>

)

}

function StatusItem({label,status}){

return(

<div style={{
display:"flex",
justifyContent:"space-between",
marginBottom:"15px"
}}>

<span style={{color:"#cbd5e1"}}>{label}</span>

<span style={{color:"#22c55e",fontWeight:"600"}}>
{status}
</span>

</div>

)

}

/* ================= STYLES ================= */

const layoutStyle={
display:"flex",
minHeight:"100vh",
background:"radial-gradient(circle at top left,#0b1120,#020617 60%)",
color:"white"
}

const panelStyle = {
  background: "#111827",
  padding: "35px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 15px 100px rgba(0,0,0,0.4)",
};

const sidebarStyle={
width:"260px",
background:"#0f172a",
padding:"35px 25px"
}

const contentStyle={
flex:1,
padding:"50px"
}

const heroSection={
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"50px"
}

const heroTitle={fontSize:"32px",fontWeight:"700"}
const heroSubtitle={color:"#94a3b8",marginTop:"8px"}

const liveBadge={
background:"rgba(34,197,94,0.1)",
color:"#22c55e",
padding:"8px 16px",
borderRadius:"50px",
fontSize:"13px",
fontWeight:"600",
border:"1px solid rgba(34,197,94,0.3)"
}

const kpiGrid={
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"30px",
marginBottom:"30px"
}

const oceanKpiStrip={
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:"20px",
marginBottom:"30px"
}

const miniCard={
background:"#1e293b",
padding:"20px",
borderRadius:"16px"
}

const activeBtn={
padding:"10px 20px",
marginRight:"10px",
borderRadius:"10px",
background:"#2563eb",
color:"white",
border:"none"
}

const normalBtn={
padding:"10px 20px",
marginRight:"10px",
borderRadius:"10px",
background:"#0f172a",
color:"white",
border:"1px solid #334155"
}

const cardSurface={
background:"#111827",
padding:"35px",
borderRadius:"20px",
border:"1px solid rgba(255,255,255,0.05)",
boxShadow:"0 15px 40px rgba(0,0,0,0.4)"
}

const panelTitle={marginBottom:"20px",fontSize:"18px"}

export default App
