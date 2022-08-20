import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const rows = useRef();
  const columns = useRef();
  const colors = useRef();

  const [gridRows, setRows] = useState(0);
  const [gridColumns, setColumns] = useState(0);
  const [gridColors, setColors] = useState(0);

  const [randomColors, setRandomColors] = useState([]);
  const [grid, setGrid] = useState([]);
  const [largestGroup, setLargestGroup] = useState([]);
  const [generate, setGenerate]=useState(false)

  useEffect(() => {
    let colors = [];
    for (let i in Array(gridColors).fill(null)) {
      let color = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ];
      let rgb = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      colors.push({
        backgroundColor: rgb,
        border: "2px solid " + rgb,
      
      });
    }
    setRandomColors(colors);
  }, [gridColumns, gridColors, gridRows, generate]);

  useEffect(() => {
    let grid = [];
    for (let i in Array(gridRows).fill(null)) {
      grid.push([]);
      for (let j in Array(gridColumns).fill(null)) {
        let random = Math.floor(Math.random() * gridColors);
        grid[i].push([random, randomColors[random]]);
      }
    }
    setGrid(grid);
  }, [randomColors]);

  useEffect(() => {
    function adjascentElements(arr, count, visited, color, indexes) {
      let rows = arr.length;
      let columns = arr[1]?.length ?? 1;
      let gvisited = visited;
      let gcount = count;
      let initialI = indexes[0];
      let initialJ = indexes[1];
      return function recurse(i = initialI, j = initialJ) {
        if (
          j < columns - 1 &&
          arr[i][j + 1] === color &&
          gvisited.indexOf("" + i + "," + (j + 1)) < 0
        ) {
          gcount += 1;
          gvisited += " " + i + "," + (j + 1);
          recurse(i, j + 1, gcount, gvisited);
        }
        if (
          j > 0 &&
          arr[i][j - 1] === color &&
          gvisited.indexOf("" + i + "," + (j - 1)) < 0
        ) {
          gcount += 1;
          gvisited += " " + i + "," + (j - 1);
          recurse(i, j - 1, gcount, gvisited);
        }
        if (
          i < rows - 1 &&
          arr[i + 1][j] === color &&
          gvisited.indexOf("" + (i + 1) + "," + j) < 0
        ) {
          gcount += 1;
          gvisited += " " + (i + 1) + "," + j;
          recurse(i + 1, j, gcount, gvisited);
        }
        if (
          i > 0 &&
          arr[i - 1][j] === color &&
          gvisited.indexOf("" + (i - 1) + "," + j) < 0
        ) {
          gcount += 1;
          gvisited += " " + (i - 1) + "," + j;
          recurse(i - 1, j, gcount, gvisited);
        }

        return [gcount, gvisited];
      };
    }

    let codegrid = [];
    for (let i in grid) {
      codegrid.push([]);
      for (let j in grid[i]) {
        codegrid[i][j] = grid[i][j][0];
      }
    }
    console.log("codegrid is", codegrid);
    let largestGroup = codegrid.reduce(
      (acc, row, i) => {
        row.map((color, j) => {
          let visited = i.toString() + "," + j.toString();
          let group = adjascentElements(codegrid, 1, visited, color, [i, j])();

          if (acc["count"] < group[0]) {
            acc.count = group[0];
            acc.indexes = group[1].split(" ");
          }
        });
        return acc;
      },
      { count: 0, indexes: [] }
    );
    setLargestGroup(largestGroup);
    console.log("Largest Group is", largestGroup);
  }, [grid]);

  console.log("Grid is", grid);

  const handleClick = () => {
    setRows(parseInt(rows.current.value));
    setColumns(parseInt(columns.current.value));
    setColors(parseInt(colors.current.value));
  };

  console.log("here", grid.current);
  const groupedGrid = largestGroup ? finalResult(grid, largestGroup) : null;
  console.log("result", groupedGrid);
  return (
    <>
    <div style={{display:"flex",justifyContent:"center", width:"100vw", height:"100vh",  background: "linear-gradient(90deg,lightblue, white)"}}>
      <div>
      <h1 align="center">Assignment 2</h1>
      <table style={{margin:"20px",maxWidth:"500px"}}>
      <tr>
      <td><label htmlFor="rows" > Enter the no. of Rows :  </label></td> <td> <input id="rows" placeholder="Rows" type="number" ref={rows} /></td>
       </tr>
       <tr>
       <td><label htmlFor="columns" > Enter the no. of Columns : </label></td><td><input id="columns" placeholder="Columns" type="number" ref={columns} /></td>
       </tr>
       <tr>
       <td><label htmlFor="colors" > Enter the no. of Colors : </label></td><td><input id="colors" placeholder="Colors" type="number" ref={colors} /></td>
       </tr>
       <tr>
       <td></td><td ><button onClick={handleClick}>Generate</button>
     <button onClick={()=>setGenerate(!generate)}>Regenerate</button></td>
       </tr>
       </table>
     
      {groupedGrid ? (
        <div className="grid">
          {groupedGrid.map((item, i) => (
            <div key={"" + i} className="row">
              {item.map((style, j) => (
                <div
                  key={"a" + j}
                  className={"colorBox"}
                  style={
                    style[1]
                      ? { ...style[0][1], border: "2px solid black", fontSize: 5/(gridRows)+"vw",width:"100%",height:"100%", boxSizing:"border-box",flex:"1 1 1", gap:'0',padding:'0px'}
                      : {...style[0][1] ,width:"100%",height:"100%",boxSizing:"border-box", flex:"1 1 1"  }
                  }>
                
                 {style[1]}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
      </div>
    </div>
    </>
  );
}

function finalResult(grid, largestGroup) {
  const result = [];
  for (let i in grid) {
    let iint = parseInt(i);
    result.push([]);
    for (let j in grid[i]) {
      let jint = parseInt(j);
      let found = 0;
      for (let k in largestGroup["indexes"]) {
        if (
          largestGroup["indexes"] &&
          largestGroup["indexes"][k] === "" + iint + "," + jint
        ) {
          result[iint].push([grid[iint][jint], largestGroup["count"]]);
          found = 1;
        }
      }
      if (found === 0) {
        result[iint].push([grid[iint][jint], null]);
      }
    }
  }
  return result;
}
