import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const defaultForm = {
  gadgetName: "",
  category: "",
  manufacturer: "",
  healthRating: "",
  techBrand: "",
  role: "",
};

function App() {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [gadgets, setGadgets] = useState([]);
  const [savedMessage, setSavedMessage] = useState("");
  const [currentView, setCurrentView] = useState("form");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo(
    () => [
      {
        header: "Gadget Name",
        accessorKey: "gadgetName",
      },
      {
        header: "Category",
        accessorKey: "category",
      },
      {
        header: "Manufacturer",
        accessorKey: "manufacturer",
      },
      {
        header: "Health Rating",
        accessorKey: "healthRating",
      },
      {
        header: "Tech Brand",
        accessorKey: "techBrand",
      },
      {
        header: "Role",
        accessorKey: "role",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: gadgets,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const validateForm = (currentForm) => {
    const newErrors = {};
    const ratingNumber = Number(currentForm.healthRating);

    if (currentForm.gadgetName.trim().length < 3) {
      newErrors.gadgetName = "Gadget name must be at least 3 characters.";
    }

    if (!currentForm.category) {
      newErrors.category = "Please choose a category.";
    }

    if (!currentForm.manufacturer.trim()) {
      newErrors.manufacturer = "Manufacturer is required.";
    }

    if (!currentForm.healthRating) {
      newErrors.healthRating = "Health rating is required.";
    } else if (
      Number.isNaN(ratingNumber) ||
      ratingNumber < 1 ||
      ratingNumber > 100
    ) {
      newErrors.healthRating = "Health rating must be from 1 to 100.";
    }

    if (!currentForm.techBrand.trim()) {
      newErrors.techBrand = "Tech brand name is required.";
    }

    if (!currentForm.role) {
      newErrors.role = "Please select a user role.";
    }

    return newErrors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);
    setErrors(validateForm(updatedForm));
    setSavedMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formErrors = validateForm(form);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setSavedMessage("");
      return;
    }

    const newGadget = {
      id: Date.now(),
      gadgetName: form.gadgetName.trim(),
      category: form.category,
      manufacturer: form.manufacturer.trim(),
      healthRating: Number(form.healthRating),
      techBrand: form.techBrand.trim(),
      role: form.role,
    };

    setGadgets([...gadgets, newGadget]);
    setForm(defaultForm);
    setErrors({});
    setSavedMessage(`${newGadget.gadgetName} was added to the inventory.`);
    setPagination({
      pageIndex: 0,
      pageSize: 5,
    });
    setCurrentView("registry");
  };

  const handleShowForm = () => {
    setSavedMessage("");
    setCurrentView("form");
  };

  const handleShowRegistry = () => {
    setSavedMessage("");
    setCurrentView("registry");
  };

  return (
    <Box className="app">
      <Box className="page">
        <Stack className="page-header" spacing={1}>
          <Typography variant="h4" component="h1">
            Tech Gadget Inventory Hub
          </Typography>
          <Typography variant="body1">
            Register Set C gadgets with complete inventory details.
          </Typography>
        </Stack>

        {currentView === "form" ? (
          <Paper className="form-card" elevation={0}>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Stack
                className="section-title-row"
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h5" component="h2">
                    Gadget Registration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saved gadgets: {gadgets.length}
                  </Typography>
                </Stack>

                <Button
                  variant="outlined"
                  onClick={handleShowRegistry}
                  disabled={gadgets.length === 0}
                >
                  View Registry
                </Button>
              </Stack>

              {savedMessage && <Alert severity="success">{savedMessage}</Alert>}

              <TextField
                label="Gadget Name"
                name="gadgetName"
                value={form.gadgetName}
                onChange={handleInputChange}
                error={Boolean(errors.gadgetName)}
                helperText={errors.gadgetName || " "}
                fullWidth
              />

              <FormControl fullWidth error={Boolean(errors.category)}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Smartphone">Smartphone</MenuItem>
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Wearable">Wearable</MenuItem>
                  <MenuItem value="Audio">Audio</MenuItem>
                </Select>
                <FormHelperText>{errors.category || " "}</FormHelperText>
              </FormControl>

              <TextField
                label="Manufacturer"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleInputChange}
                error={Boolean(errors.manufacturer)}
                helperText={errors.manufacturer || " "}
                fullWidth
              />

              <TextField
                label="Health Rating"
                name="healthRating"
                type="number"
                value={form.healthRating}
                onChange={handleInputChange}
                error={Boolean(errors.healthRating)}
                helperText={errors.healthRating || "1 to 100"}
                inputProps={{ min: 1, max: 100 }}
                fullWidth
              />

              <TextField
                label="Tech Brand Name"
                name="techBrand"
                value={form.techBrand}
                onChange={handleInputChange}
                error={Boolean(errors.techBrand)}
                helperText={errors.techBrand || " "}
                fullWidth
              />

              <FormControl error={Boolean(errors.role)}>
                <FormLabel>User Role</FormLabel>
                <RadioGroup
                  row
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="Engineer"
                    control={<Radio />}
                    label="Engineer"
                  />
                  <FormControlLabel
                    value="Tester"
                    control={<Radio />}
                    label="Tester"
                  />
                </RadioGroup>
                <FormHelperText>{errors.role || " "}</FormHelperText>
              </FormControl>

              <Button type="submit" variant="contained" size="large">
                Save Gadget
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Paper className="registry-card" elevation={0}>
            <Stack spacing={3}>
              <Stack
                className="section-title-row"
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h5" component="h2">
                    Gadget Registry
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Showing {table.getRowModel().rows.length} of{" "}
                    {gadgets.length} saved gadgets
                  </Typography>
                </Stack>

                <Button variant="contained" onClick={handleShowForm}>
                  Add Another Gadget
                </Button>
              </Stack>

              <TableContainer className="table-shell">
                <Table>
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableCell key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.original.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                          No gadgets have been registered yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack
                className="pagination-row"
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
              >
                <Typography variant="body2" color="text.secondary">
                  Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default App;
