import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Smart_Scrap_SearchFactoryGroup from "../components/SearchGroup/Smart_Scrap_SearchFactoryGroup";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon


export default function Scrap_Record_Weight_Daily_Transaction({ onSearch }) {
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editedTotalWeight, setEditedTotalWeight] = useState('');
  const [editedTotalWeightDisabled, setEditedTotalWeightDisabled] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const columns = [
    { field: 'waste_factory_name', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_group', headerName: 'Group', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header'},
    { field: 'waste_date_take_off', headerName: 'Date take off', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_item', headerName: 'Waste Item', width: 300 , headerAlign: 'center' , headerClassName: 'bold-header'},
    { field: 'total', headerName: 'Total', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center',
      renderCell: (params) => (
        <input
          type="input"
          value={params.value}
          onChange={(e) => handleTotalChange(params.id, e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, params.id)}
          style={{ width: 130 , height: '30px' , textAlign:'center'}}
          disabled={params.row.detail >= 0}
        />
      ),
    },
    { field: 'detail', headerName: 'Details', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center',
      renderCell: (params) => (
        <input
          type="input"
          value={params.value}
          onChange={(e) => handleTotalChange(params.id, e.target.value)}
          style={{ width: 130 , height: '30px' , textAlign:'center'}}
          disabled={params.row.detail >= 0}
        />
      ),
    },
    { field: 'update_by', headerName: 'Update By', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center'},
    { field: 'update_date', headerName: 'Update Date', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center'},
    { field: 'record_weight', headerName: 'Record Weight', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center',
      renderCell: (params) => (
        <input
          type="button"
          value={"Key Weight"}
          style={{ width: 130 , height: '35px' , textAlign:'center' , backgroundColor: '#FFCD4B' , 
          cursor:"pointer" , borderRadius: '15px'}}
          onClick={() => handleKeyWeightClick(params.row.id)} // Call the handleKeyWeightClick function with the row ID or any other identifier you need
        />
      ),
    },
  ]
  
  const handleTotalChange = (id, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, total: value } : row
    );
    setRows(updatedRows);
  };

  const handleKeyWeightClick = (row) => {
    setSelectedRecord(row);
    setEditedTotalWeight(row.total || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedTotalWeightDisabled(true);
  };

  const handleTotalWeightChange = (e) => {
    console.log('Handling total weight change');
    const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');

    // Ensure the value is a valid number
    if (/^-?\d*\.?\d*$/.test(sanitizedValue)) {
      setEditedTotalWeight(sanitizedValue);
    }

    // Assuming distinct_record_weight is another state variable
    const updatedRows = distinct_record_weight.map((row) =>
      row.id === id ? { ...row, total: editedTotalWeight } : row
    );

    // Set the updated rows
    setDistinct_record_weight(updatedRows);
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleTotalWeightChange(e, id);
    }
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTotalWeightDisabled(false);
  };
  
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const [distinct_record_weight, setDistinct_record_weight] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetch_record_weight = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(`http://10.17.66.242:3001/api/smart_scrap/filter-daily-transaction?date_take_of=${selectedDate}&group=${selectedGroup}&factory=${selectedFactory}`);
        const data = await response.data;
        console.log(data);
        // Add a unique id property to each row
        const rowsWithId = data.map((row, index) => ({
            ...row,
            id: index, // You can use a better unique identifier here if available
        }));
        setDistinct_record_weight(rowsWithId);
        } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data record_weight');
        } finally {
          setIsLoading(false); // Set isLoading back to false when fetch is complete
        }
    };

    useEffect(() => {
      if (selectedFactory && selectedGroup && selectedDate) {
        fetch_record_weight();
      }
    }, [selectedFactory, selectedGroup, selectedDate]);

    function getCode(item) {
      // Split the string based on the '/' separator and get the first part
      const parts = item.split('/');
      return parts[0] ? parts[0].trim() : '';
    }

    function getDescription(item) {
      // Split the string based on the '/' separator and get the second part
      const parts = item.split('/');
      return parts[1] ? parts[1].trim() : '';
    }


  return (
    <div className="table-responsive table-fullscreen" style={{ height: 800, width: '1600' , marginTop: '5px' }}>
        <div >
            {/* <Smart_Scrap_SearchFactoryGroup onSearch={onSearch} /> */}
            <Smart_Scrap_SearchFactoryGroup
                onSearch={(queryParams) => {
                  setSelectedFactory(queryParams.factory);
                  setSelectedGroup(queryParams.group);
                  setSelectedDate(queryParams.date_take_of);
                }}
            />
        </div>
        <Box sx={{width: '1570px' , height: 725 , marginTop: '25px'}}>
            {isLoading ? (
              <CircularProgress /> // Display a loading spinner while data is being fetched
            ) : (
              <DataGrid
                columns={columns}
                // disableColumnFilter
                // disableDensitySelector
                rows={distinct_record_weight}
                onRowClick={(params, event) => handleKeyWeightClick(params.row)}
                slots={{ toolbar: GridToolbar }}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                columnVisibilityModel={columnVisibilityModel}
                // checkboxSelection
                onColumnVisibilityModelChange={(newModel) =>
                  setColumnVisibilityModel(newModel)
                }
              />
            )}
        </Box>
        {/* Modal for "Key Weight" button */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="key-weight-modal-title"
          aria-describedby="key-weight-modal-description"
        >
          
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: '#AED2FF', border: '2px solid #000', boxShadow: 24, p: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' , fontFamily: 'Lucida Sans'}}>
                <div style={{textAlign: 'center' , fontWeight: 'bold' , fontSize: '20px' , marginBottom: '10px'}}>
                    <label htmlFor="" >Key weight details by item scrap</label>
                </div>
                <div>
                    <IconButton onClick={handleCloseModal} style={{position: 'absolute', top: '10px', right: '10px',}}>
                        <CloseIcon style={{fontSize: '24px', color: 'white', backgroundColor: '#E55604'}} />
                    </IconButton>
                </div>
            </div>
            <div style={{ height: 550}}>
                <div style={{ border: '1px solid black' , height: 140 , backgroundColor: '#E4F1FF'}}>
                    <div>
                      <label style={{marginLeft: '25px' ,marginTop: '15px' , fontSize: 16}}>Date take off :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '15px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE'}} type="text" value={selectedDate} disabled/> 

                      <label style={{marginLeft: '75px' ,marginTop: '15px' , fontSize: 16}}>Factory :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '15px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE'}} type="text" value={selectedFactory} disabled/> 
                    </div>
                    <div>
                      <label style={{marginLeft: '33px' ,marginTop: '10px' , fontSize: 16}}>Group code :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE'}} type="text" value={selectedRecord ?  getCode(selectedRecord.waste_group) : ''} disabled/> 

                      <label style={{marginLeft: '38px' ,marginTop: '10px' , fontSize: 16}}>Group Desc. :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 280 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE'}} type="text" value={selectedRecord ? getDescription(selectedRecord.waste_group) : ''} disabled/> 
                    </div>
                    <div>
                      <label style={{marginLeft: '46px' ,marginTop: '10px' , fontSize: 16}}>Item code :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE'}} type="text" value={selectedRecord ?  getCode(selectedRecord.waste_item) : ''} disabled/> 

                      <label style={{marginLeft: '52px' ,marginTop: '10px' , fontSize: 16}}>Item Desc. :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 280 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE'}} type="text" value={selectedRecord ? getDescription(selectedRecord.waste_item) : ''} disabled/> 
                    </div>
                </div>
                <div style={{paddingTop: '10px' , display: 'flex'}}>
                  <label style={{marginTop: '3px'}}>Total Weight :</label>
                  <input  style={{marginLeft: '10px', fontSize: 16 , fontWeight: 'bold', width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' }} 
                          type="text" 
                          value={editedTotalWeight !== null ? editedTotalWeight : ''}
                          // onChange={(e) => setEditedTotalWeight(e.target.value)}
                          onChange={(e) => handleTotalWeightChange(e)}
                          disabled={!isEditing || editedTotalWeightDisabled}
                  />
                  <td><input type="button" style={{marginLeft:'3px' , width: 40 , height: 30 ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer" , cursor:"pointer"}} value={"Edit"} onClick={handleEditClick}/></td>
                </div>
                {/* <div style={{display: 'flex'}} id="all_details">
                    <div>
                        <table>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '10px'}}>Detail 1 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '10px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled={!isEditing}/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '9px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer" , cursor:"pointer"}} value={"Edit"} onClick={handleEditClick}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 2 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled={!isEditing}/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"} onClick={handleEditClick}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 3 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 4 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 5 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 6 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 7 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 8 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '20px' , paddingTop: '5px'}}>Detail 9 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: '10px' , paddingTop: '5px'}}>Detail 10 :</td>
                                <td style={{paddingLeft: '5px' , paddingTop: '5px'}}><input style={{width: 100 , height: 30 , border: '1px solid black' , borderRadius: '5px'}} type="text" disabled/></td>
                                <td><input type="button" style={{width: 40 , height: 30 , marginTop: '5px' ,border: '1px solid black' , borderRadius: '5px' , backgroundColor: '#FFB000' , cursor:"pointer"}} value={"Edit"}/></td>
                            </tr>
                        </table>
                    </div>
                </div> */}
            </div>
          </Box>
        </Modal>
    </div>
  );
}