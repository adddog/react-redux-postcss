import React, {PropTypes} from 'react';

import util from 'util';



const Dashboard = ({data, map, items, secretData, onSubmit, handleChange}) => (
  <Card className="container">
    <CardTitle
      title="Dashboard"
    />
    {/*{ console.log(util.inspect(secretData)) }*/}
    {/*{ console.log(util.inspect(items))}*/}
    {secretData && items && <DropDownMenu maxHeight={500} value={items[0]} onChange={handleChange}>{items}</DropDownMenu>}
    {/*{data && <Table columns={columns} data={data} />}*/}
        {/*<RaisedButton type="submit" label="Go" primary/>*/}
  </Card>
);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
};

export default Dashboard;
