import React, { useState, useMemo } from "react";
import { FormHelperText } from "@mui/material";
import { Grid, CardActions, Box, Container, Paper, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  useMediaQuery,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  CssBaseline,
  InputAdornment,
  Card,
  CardContent,
  useTheme, Link
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Add as AddIcon,
  Search as SearchIcon,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";

// Custom styled AuthLogo component
const AuthLogo = () => (
  <Box
    component="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    sx={{ width: 40, height: 40, fill: "currentColor" }}
  >
    <path d="M12 2C9.79 2 8 3.79 8 6V10H6C4.9 10 4 10.9 4 12V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V12C20 10.9 19.1 10 18 10H16V6C16 3.79 14.21 2 12 2ZM12 6C13.1 6 14 6.9 14 8V10H10V8C10 6.9 10.9 6 12 6ZM6 12H18V18H6V12Z" />
  </Box>
);

const AdminDashboard = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [userDialog, setUserDialog] = useState({ 
    open: false, 
    user: { name: "", email: "", role: "", status: "active" },
    emailError: "" 
  });
  const [roleDialog, setRoleDialog] = useState({ 
    open: false, 
    role: { name: "", permissions: [] } 
  });
  
  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if mobile view

  
  // Filter and sort data
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  // Notification handler
  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchQuery("");
    setSortConfig({ key: null, direction: 'asc' });
  };

  // User management handlers
  const handleUserSave = () => {
    const { user } = userDialog;
    if (user.name && user.email && !userDialog.emailError && user.role) {
      if (user.id) {
        setUsers(users.map((u) => (u.id === user.id ? user : u)));
        showNotification("User updated successfully");
      } else {
        setUsers([...users, { ...user, id: Date.now() }]);
        showNotification("User added successfully");
      }
      setUserDialog({ open: false, user: { name: "", email: "", role: "", status: "active" }, emailError: "" });
    } else {
      showNotification("Please fill in all fields correctly", "error");
    }
  };
  

  // Role management handlers
  const handleRoleSave = () => {
    const { role } = roleDialog;
    if (role.name && role.permissions.length > 0) {
      if (role.id) {
        setRoles(roles.map((r) => (r.id === role.id ? role : r)));
        showNotification("Role updated successfully");
      } else {
        setRoles([...roles, { ...role, id: Date.now() }]);
        showNotification("Role added successfully");
      }
      setRoleDialog({ open: false, role: { name: "", permissions: [] } });
    } else {
      showNotification("Please fill in all required fields", "error");
    }
  };
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    showNotification("User deleted successfully");
  };
  const handleDelete = (type, id) => {
    if (type === "user") {
      setUsers(users.filter((user) => user.id !== id));
      showNotification("User deleted successfully");
    } else if (type === "role") {
      setRoles(roles.filter((role) => role.id !== id));
      showNotification("Role deleted successfully");
    }
  };
  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
    showNotification("Role deleted successfully");
  };

  // Table header cell component with sorting
  const SortableTableCell = ({ label, sortKey }) => (
    <TableCell>
      <TableSortLabel
        active={sortConfig.key === sortKey}
        direction={sortConfig.key === sortKey ? sortConfig.direction : 'asc'}
        onClick={() => handleSort(sortKey)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
  const sortData = (data, sortConfig) => {
    if (!sortConfig.key) return data; // No sorting if no sort key is set
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key] || ""; // Fallback to empty string
      const bValue = b[sortConfig.key] || "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  };
  const sortedUsers = useMemo(() => sortData(filteredUsers, sortConfig), [filteredUsers, sortConfig]);
const sortedRoles = useMemo(() => sortData(filteredRoles, sortConfig), [filteredRoles, sortConfig]);

const filterData = (data, searchQuery) => {
  if (!searchQuery) return data; // No filtering if search query is empty
  return data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
};

// Combined logic: Filtered and Sorted Data
const filteredAndSortedUsers = useMemo(() => {
  const filtered = filterData(users, searchQuery); // Apply search filter
  return sortData(filtered, sortConfig); // Apply sorting
}, [users, searchQuery, sortConfig]);

const filteredAndSortedRoles = useMemo(() => {
  const filtered = filterData(roles, searchQuery);
  return sortData(filtered, sortConfig);
}, [roles, searchQuery, sortConfig]);
  

  return (
    <>
      <CssBaseline />
      
      
      {/* Enhanced AppBar */}
      <AppBar position="sticky" elevation={0} >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AuthLogo />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AuthGuard
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Enhanced Tab Navigation */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                }
              }}
            >
              <Tab 
                icon={<PersonIcon />} 
                label="Users" 
                iconPosition="start" 
                sx={{ px: 4 }}
              />
              <Tab 
                icon={<SecurityIcon />} 
                label="Roles" 
                iconPosition="start"
                sx={{ px: 4 }}
              />
            </Tabs>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={`Search ${tabValue === 0 ? 'users' : 'roles'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Users Tab */}
      {tabValue === 0 && (
  <Paper sx={{ p: 0, borderRadius: 1, overflow: "hidden" }}>
    {users.length === 0 ? (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="body1" color="text.secondary">
          No users found. Add a user to get started.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            setUserDialog({ open: true, user: { name: "", email: "", role: "", status: "active" } })
          }
          sx={{ mt: 2 }}
        >
          Add User
        </Button>
      </Box>
    ) : (
      <>
        {isMobile ? (
          // Mobile Card View for Users
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {filteredAndSortedUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2">{user.email}</Typography>
                    <Typography variant="body2">Role: {user.role}</Typography>
                    
                    {/* Status Indicator */}
                    <Chip
                      label={user.status === "active" ? "Active" : "Inactive"}
                      color={user.status === "active" ? "success" : "default"}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    <IconButton
                      onClick={() => setUserDialog({ open: true, user })}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Desktop Table View for Users
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <SortableTableCell label="Name" sortKey="name" />
                  <SortableTableCell label="Email" sortKey="email" />
                  <SortableTableCell label="Role" sortKey="role" />
                  <SortableTableCell label="Status" sortKey="status" />
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    
                    {/* Status Indicator */}
                    <TableCell>
                      <Chip
                        label={user.status === "active" ? "Active" : "Inactive"}
                        color={user.status === "active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell align="right">
                      <IconButton
                        onClick={() => setUserDialog({ open: true, user })}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Add User Button */}
        <Box sx={{ textAlign: "right", p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              setUserDialog({ open: true, user: { name: "", email: "", role: "", status: "active" } })
            }
          >
            Add User
          </Button>
        </Box>
      </>
    )}
  </Paper>
)}


        {/* Roles Tab */}
        
        {tabValue === 1 && (
  <Paper sx={{ p: 0, borderRadius: 1, overflow: "hidden" }}>
    {roles.length === 0 ? (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="body1" color="text.secondary">
          No roles found. Add a role to get started.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            setRoleDialog({ open: true, role: { name: "", permissions: [] } })
          }
          sx={{ mt: 2 }}
        >
          Add Role
        </Button>
      </Box>
    ) : (
      <>
        {isMobile ? (
          // Mobile Card View for Roles
          <Grid container spacing={2} sx={{ mt: 2 }}>
          {filteredAndSortedRoles.map((role) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={role.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{role.name}</Typography>
                  <Typography variant="body2">
                    Permissions: {role.permissions.join(", ")}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => setRoleDialog({ open: true, role })}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRole(role.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        ) : (
          // Desktop Table View for Roles
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                <SortableTableCell label="Name" sortKey="name" />
                <SortableTableCell label="Permissions" sortKey="permissions" />
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRoles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      {role.permissions.map((permission) => (
                        <Chip
                          key={permission}
                          label={permission}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => setRoleDialog({ open: true, role })}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteRole(role.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Add Role Button */}
        <Box sx={{ textAlign: "right", p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              setRoleDialog({ open: true, role: { name: "", permissions: [] } })
            }
          >
            Add Role
          </Button>
        </Box>
      </>
    )}
  </Paper>
)}



        {/* Enhanced User Dialog */}
        <Dialog
  open={userDialog.open}
  onClose={() => setUserDialog({ open: false, user: {}, emailError: '' })}
>
  <DialogTitle>{userDialog.user.id ? 'Edit User' : 'Add User'}</DialogTitle>
  <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
      {/* Name Field */}
      <TextField
        label="Name" required
        value={userDialog.user.name}
        onChange={(e) =>
          setUserDialog({ ...userDialog, user: { ...userDialog.user, name: e.target.value } })
        }
        fullWidth
      />

      {/* Email Field */}
      <TextField
        label="Email" required
        value={userDialog.user.email}
        onChange={(e) =>
          setUserDialog({ ...userDialog, user: { ...userDialog.user, email: e.target.value } })
        }
        onBlur={() => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          // Check for valid email and duplicates
          if (!emailRegex.test(userDialog.user.email)) {
            setUserDialog({
              ...userDialog,
              emailError: 'Please enter a valid email address',
            });
          } else if (
            filteredUsers.some(
              (user) =>
                user.email === userDialog.user.email &&
                user.id !== userDialog.user.id // Ignore current user during editing
            )
          ) {
            setUserDialog({
              ...userDialog,
              emailError: 'This email is already in use',
            });
          } else {
            setUserDialog({
              ...userDialog,
              emailError: '',
            });
          }
        }}
        error={!!userDialog.emailError}
        helperText={userDialog.emailError}
        fullWidth
      />

      {/* Role Selector */}
      <FormControl fullWidth required >
  <InputLabel id="role-label">Role</InputLabel>
  <Select
    labelId="role-label"
    id="role-select"
    value={userDialog.user.role}
    onChange={(e) =>
      setUserDialog({ ...userDialog, user: { ...userDialog.user, role: e.target.value } })
    }
    label="Role"
  >
    {roles.length > 0 ? (
      roles.map((role) => (
        <MenuItem key={role.id} value={role.name}>
          {role.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No roles available</MenuItem>
    )}
  </Select>
  {!roles.length && (
    <Typography
      color="error"
      variant="body2"
      sx={{ mt: 1, cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => {
        setTabValue(1); // Navigate to Role Management tab
        setUserDialog({ open: false, user: { name: '', email: '', role: '', status: 'active' } }); // Close the dialog
      }}
    >
      No roles available. Click here to add a role.
    </Typography>
  )}
 
</FormControl>

      {/* Status Selector */}
      <FormControl fullWidth>
        <InputLabel id="status-label" required>Status</InputLabel>
        <Select
          labelId="status-label"
          id="status-select"
          value={userDialog.user.status}
          onChange={(e) =>
            setUserDialog({ ...userDialog, user: { ...userDialog.user, status: e.target.value } })
          }
          label="Status"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setUserDialog({ open: false, user: {}, emailError: '' })}>
      Cancel
    </Button>
    <Button
      onClick={handleUserSave}
      variant="contained"
      disabled={!userDialog.user.email || !!userDialog.emailError}
    >
      Save
    </Button>
  </DialogActions>
</Dialog>


        {/* Role Dialog */}
        <Dialog 
  open={roleDialog.open} 
  onClose={() => setRoleDialog({ open: false, role: { name: "", permissions: [] } })}
>
  <DialogTitle>{roleDialog.role.id ? "Edit Role" : "Add Role"}</DialogTitle>
  <DialogContent>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
      <TextField
        required label="Role Name"
        value={roleDialog.role.name || ""}
        onChange={(e) =>
          setRoleDialog({
            ...roleDialog,
            role: { ...roleDialog.role, name: e.target.value },
          })
        }
        fullWidth
      />
      <TextField
       required label="Permissions (comma separated)"
        value={roleDialog.role.permissions?.join(", ") || ""}
        onChange={(e) =>
          setRoleDialog({
            ...roleDialog,
            role: { ...roleDialog.role, permissions: e.target.value.split(", ").map(p => p.trim()) },
          })
        }
        fullWidth
      />
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setRoleDialog({ open: false, role: { name: "", permissions: [] } })}>
      Cancel
    </Button>
    <Button onClick={handleRoleSave} variant="contained">
      Save
    </Button>
  </DialogActions>
</Dialog>


        {/* Notification Snackbar */}
        <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ open: false })}>
          <Alert onClose={() => setNotification({ open: false })} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
      
      <Box
        sx={{
          bgcolor: "#0865cf",
          color: "white",
          py: 2,
          mt: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Typography variant="body2">
              © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
            </Typography>
            <Box display="flex" gap={2}>
              <Link href="https://github.com/medha-3102" target="_blank" color="inherit">
                <GitHub />
              </Link>
              <Link href="https://www.linkedin.com/in/medha-gupta-5b6838185/" target="_blank" color="inherit">
                <LinkedIn />
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

    </>
    
  );
};

export default AdminDashboard;
