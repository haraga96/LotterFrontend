import { useEffect, useState } from "react";
import "./App.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { Todo } from "./models/todo";
import { ApiResponse } from "./models/apiResponse";

export default function TodosGrid() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    (async function () {
      const response = (await callApi()) as ApiResponse<Todo[]>;
      setTodos(response.data);
      setTotalCount(response.metadata.totalCount || 0);
    })();
  }, [paginationModel]);

  const callApi = async () => {
    const response = await fetch(
      `https://localhost:5000/api/todo?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 230 },
    { field: "content", headerName: "Content", width: 300 },
    {
      field: "creationTime",
      headerName: "Creation Time",
      width: 150,
      valueGetter: (_, row) =>
        `${new Date(row.creationTime).toLocaleDateString()}`,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 160,
      valueGetter: (_, row) => `${new Date(row.dueDate).toLocaleDateString()}`,
    },
    { field: "status", headerName: "Status", width: 130 },
    { field: "type", headerName: "Type", width: 130 },
  ];

  const rows = todos;

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={totalCount}
        paginationMode="server"
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        onPaginationModelChange={setPaginationModel}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
