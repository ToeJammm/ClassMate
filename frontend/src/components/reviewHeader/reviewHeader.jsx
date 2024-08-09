import axios from 'axios';
import "./reviewHeader.css";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';

const apiUrl = __API_BASE_URL__;

export default function ReviewHeader( {uniID, classID, className, reviews}) {
    const [data, setData] = useState([]);


function fetchData() {
  const mappedQualities = reviews.map(rating => rating.QualityValue);
  const mappedDifficulty = reviews.map(rating => rating.DifficultyValue);
  setData([
    {name: "Difficulty", dif: mappedDifficulty.reduce((a, b) => a + b, 0) / mappedDifficulty.length},
    {name: "Utility", qual: mappedQualities.reduce((a, b) => a + b, 0) / mappedQualities.length}
  ])
}

//Call this function at the start AND whenever the commentLength changes
useEffect(() => {
    console.log("name: ", className);
    fetchData();
}, []);

useEffect(() => {
  fetchData();
}, [reviews]);

const SimpleLineChart = () => (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        background={{ fill: '#000000' }}
        barGap="-35%"
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5,]}/>
        <Bar dataKey="dif" barSize="15%" fill="#808080" name="Difficulty">
          <LabelList dataKey="dif"position="top" formatter={(value) => (value ? value.toString().substring(0,3) : '')}/>    
        </Bar>
        <Bar dataKey="qual" barSize="15%" fill="#000000" name="Utility">
          <LabelList dataKey="qual" position="top" formatter={(value) => (value ? value.toString().substring(0,3) : '')}/>    
        </Bar>
      </BarChart>
    </ResponsiveContainer>
);

  return (
    <html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
        <div className='graphContainer'>
            <div className="className-text-wrapper">
                <h2 className='className-text'>{className}</h2>
            </div>
            <SimpleLineChart />
        </div>
    </html>
  )
}


