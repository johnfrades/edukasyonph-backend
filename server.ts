import server from './index';
const port = 5000;
server.app.listen(port, () => console.log('Server started ' + port));
