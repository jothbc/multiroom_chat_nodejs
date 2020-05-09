// importar as configurações do servidor
var app = require('./config/server')

// parametrizar a porta de escuta
var server = app.listen(80,function(){
    console.log('Servidor ON')
})

var io = require('socket.io').listen(server)

app.set('io',io)

// criar a conexao por websocket
io.on('connection',function(socket){
    console.log('usuario conectou')

    socket.on('disconnect',function(){
        console.log('usuario desconectou')
    })

    socket.on('msgParaServidor',function(data){
        // dialogo
        socket.emit('msgParaCliente',{
            apelido: data.apelido,
            mensagem: data.mensagem
        })
        // emite para todos menos para quem emitiu
        socket.broadcast.emit('msgParaCliente',{
            apelido: data.apelido,
            mensagem: data.mensagem
        })

        // participantes
        if(parseInt(data.apelido_atualizado_nos_clientes)== 0 ){
            socket.emit('participantesParaCliente',{
                apelido: data.apelido
            })
            // emite para todos menos para quem emitiu
            socket.broadcast.emit('participantesParaCliente',{
                apelido: data.apelido
            })
        }
    })
})