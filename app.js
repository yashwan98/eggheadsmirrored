const { app } = require('./config');

app.listen(app.get('port'),'0.0.0.0',function(){
    console.log(`Server Started Running at ${app.get('port')}`);
})