import React from "react";
import "./App.css";
import CustomInput from "./CustomInput";
import axios from "axios";
import * as _ from "lodash";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";

function App() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  let getData = (search, page) => {
    const fetchData = async () => {
      let result = null;
      setLoading(true);
      if (search) {
        result = await axios(`/searchPost?search=${search}`);
      } else {
        result = await axios(`/post?page=${page}&limit=${limit}`);
      }
      setRows(result.data.results);
      setLoading(false);
    };
    fetchData();
  };

  let handleSearch = (value) => {
    setSearch(value);
    getData(value, null);
  };

  let handlePageChange = (value) => {
    setPage(value);
    getData(false, value);
  };

  React.useEffect(() => {
    getData("", page);
  }, []);

  return (
    <div
      style={{
        height: "75vh",
        width: "75vw",
        margin: "auto",
      }}
    >
      <CustomInput
        onChange={(event) => handleSearch(event.target.value)}
        style={{ marginLeft: "50%" }}
      />
      {loading ? (
        <div> LOADING </div>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row._id}
                  </TableCell>
                  <TableCell align="right">{row.rString}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={() => handlePageChange(page - 1)}>{"<"}</Button>
          <Button onClick={() => handlePageChange(page + 1)}>{">"}</Button>
        </TableContainer>
      )}
    </div>
  );
}

export default App;
