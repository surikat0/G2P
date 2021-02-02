const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const cors = require("cors");
const path = require("path");
const util = require("util");
const app = express();
const fs = require("fs");
const os = require("os");
const Busboy = require("busboy");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("uploads"));
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: process.env.MAX_FILESIZE * 1024 * 1024 * 1024, //max file(s) size
    },
  })
);

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "g2p",
});

const FASES = {
  dieciseisavos: 'dieciseisavos',
  octavos: 'octavos',
  cuartos: 'cuartos',
  semifinal: 'semifinal',
  final: 'final'
}

//FUNCIONAMIENTO

connection.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Conectado correctamente");
  }
});

app.get("/", function (req, res) {
  console.log("Servidor ONLINE");
  res.send("Hola!!!");
});

app.post("/upload", function (req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    var saveTo = path.join("../src/assets/images", filename);
    console.log("Uploading: " + saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on("finish", function () {
    console.log("Upload complete");
    res.writeHead(200, { Connection: "close" });
    res.end("That's all folks!");
  });
  return req.pipe(busboy);
});

// Login

app.post("/usuarios/login", function (req, response) {
  let sql =
    "SELECT * FROM usuarios WHERE (usuarios.nickname = ? AND usuarios.contrasena = ?)";
  connection.query(
    sql,
    [req.body.nickname, req.body.contrasena],
    function (err, result) {
      if (err) console.log(err);
      else {
        response.send(result);
      }
    }
  );
});

// ENPOINTS USUARIOS//

app.get("/usuarios/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT * FROM usuarios WHERE usuario_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

// OBTENER JUGADORES POR ID DE UN EQUIPO
app.get("/jugadores/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT DISTINCT equipos.equipo_id, equipos.nombre, equipos.logo, usuarios.usuario_id, usuarios.url_perfil, usuarios.nickname FROM equipo_usuario LEFT JOIN usuarios ON (equipo_usuario.usuario_id = usuarios.usuario_id) LEFT JOIN equipos ON (equipo_usuario.equipo_id = equipos.equipo_id) WHERE equipos.equipo_id =" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  })
})

// OBTEN EQUIPOS POR ID DE UN JUGADOR
app.get("/list-teams/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT DISTINCT equipos.equipo_id, equipos.nombre, equipos.logo, usuarios.usuario_id, usuarios.url_perfil, usuarios.nickname, equipos.capitan FROM equipo_usuario LEFT JOIN usuarios ON (equipo_usuario.usuario_id = usuarios.usuario_id) LEFT JOIN equipos ON (equipo_usuario.equipo_id = equipos.equipo_id) WHERE usuarios.usuario_id=" + id + " OR equipos.capitan=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  })
})

app.get("/yourTeamRank/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT DISTINCT equipos.* FROM equipo_usuario LEFT JOIN equipos ON (equipo_usuario.equipo_id = equipos.equipo_id) WHERE equipos.capitan=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  })
})

app.get("/admin-torneos", function (req, res) {
  let sql = "SELECT DISTINCT torneos.torneo_id, torneos.nombre AS torneo_nombre, juegos.juego_id AS juego_nombre, juegos.nombre, torneos.fecha, torneos.hora, torneos.puntos, reglas.reglas_id, reglas.modo, torneos.estado FROM equipos_torneos LEFT JOIN torneos ON (equipos_torneos.torneo_id = torneos.torneo_id) LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id) LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id)";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result)
  })
})


app.get("/user", function (req, res) {
  console.log(req.query);
  let sql = `SELECT * FROM usuarios WHERE nickname=\"${req.query.nickname}\"`;
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  });
});


app.get("/usuarios/correo/:id", function (req, res) {
  id = req.params.id;
  let sql = `SELECT * FROM usuarios WHERE correo=\"${req.params.id}\"`;
  connection.query(sql, function (err, result) {
    let resultado;
    if (err) {
      console.log(err);
    } else {
      var string = JSON.stringify(result);
      var json = JSON.parse(string);
      let x = json.find((id) => id === id);
      if (x === undefined) {
        resultado = false;
        console.log(false);
      } else {
        resultado = true;
        console.log(true);
      }
    }
    res.send(result);
  });
});


app.post("/usuarios/top10/", function (req, res) {
  id = req.params.id;
  let sql = `SELECT nickname, nombre, apellido, url_perfil, puntuacion FROM usuarios WHERE isBanned= false ORDER BY usuarios.puntuacion DESC LIMIT 5`;
  connection.query(sql, function (err, result) {
    let resultado;
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});


app.post("/equipos/top5/", function (req, res) {
  id = req.params.id;
  let sql = `SELECT equipos.equipo_id, equipos.nombre, equipos.logo, juegos.juego_id AS juego_id, juegos.nombre AS juego_nombre, juegos.foto AS juego_logo, usuarios.usuario_id AS capitan_id, usuarios.nickname AS capitan_nickname, equipos.ganadas, equipos.perdidas, equipos.empatadas, equipos.jugadas, equipos.biografia, equipos.puntuacion FROM equipos JOIN juegos ON(equipos.juego_id = juegos.juego_id) JOIN usuarios ON (equipos.capitan = usuarios.usuario_id) ORDER BY equipos.puntuacion DESC LIMIT 5`;
  connection.query(sql, function (err, result) {
    let resultado;
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});


app.post("/usuarios/top1/", function (req, res) {
  id = req.params.id;
  let sql = `SELECT nickname, nombre, apellido, url_perfil, puntuacion FROM usuarios WHERE isBanned= false ORDER BY usuarios.puntuacion DESC LIMIT 1`;
  connection.query(sql, function (err, result) {
    let resultado;
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/usuarios/getyourtop/", function (req, res) {
  id = req.params.id;
  let sql = `SELECT nickname, nombre, apellido, url_perfil, puntuacion FROM usuarios WHERE isBanned= false ORDER BY usuarios.puntuacion DESC`;
  connection.query(sql, function (err, result) {
    let resultado;
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/equipos/top1/", function (req, res) {
  id = req.params.id;
  let sql = `SELECT nombre, logo, puntuacion FROM equipos ORDER BY equipos.puntuacion DESC LIMIT 1`;
  connection.query(sql, function (err, result) {
    let resultado;
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.get("/usuarios/nickname/:id", function (req, res) {
  id = req.params.id;
  let sql = `SELECT * FROM usuarios WHERE nickname=\"${req.params.id}\"`;
  connection.query(sql, function (err, result) {
    let resultado;
    if (err) {
      console.log(err);
    } else {
      var string = JSON.stringify(result);
      var json = JSON.parse(string);
      let x = json.find((id) => id === id);
      if (x === undefined) {
        resultado = false;
        console.log(false);
      } else {
        resultado = true;
        console.log(true);
      }
    }
    res.send(result);
  });
});

app.get("/usuarios", function (req, res) {
  id = req.params.id;
  let sql1 = "SELECT * FROM usuarios";
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.get("/admin-usuarios", function (req, res) {
  id = req.params.id;
  let sql1 = "SELECT DISTINCT usuarios.* FROM usuarios";
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/usuarios", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO usuarios (usuario_id, nickname, nombre, apellido, url_perfil, nacimiento, correo, nacionalidad, contrasena, biografia, admin) VALUES(null, \"${req.body.nickname}\", \"${req.body.nombre}\", \"${req.body.apellido}\",\"${req.body.url_perfil}\",\"${req.body.nacimiento}\",\"${req.body.correo}\",\"${req.body.nacionalidad}\",\"${req.body.contrasena}\",\"${req.body.biografia}\",\"${req.body.admin}\")`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/usuarios/ban", function (req, response) {
  let usuario_id = req.body.usuario_id;
  let ban = req.body.isBanned;
  let url_perfil = req.body.url_perfil;
  let sql = "UPDATE usuarios SET";
  sql += ` url_perfil=\"${url_perfil}"\, isBanned=${ban} WHERE usuario_id=${usuario_id}`;
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de usuarios actualizados");
    }
    response.send(result);
  });

})

app.put("/usuarios", function (req, response) {
  let usuario_id = req.body.usuario_id;
  let nickname = req.body.nickname;
  let nombre = req.body.nombre;
  let apellido = req.body.apellido;
  let url_perfil = req.body.url_perfil;
  let nacimiento = req.body.nacimiento;
  let correo = req.body.correo;
  let nacionalidad = req.body.nacionalidad;
  let contrasena = req.body.contrasena;
  let biografia = req.body.biografia;
  let admin = req.body.admin;
  let sql = "UPDATE usuarios SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);
  if (nickname) {
    params.push(nickname);
    modi.push(" nickname = ? ");
  }
  if (nombre) {
    params.push(nombre);
    modi.push(" nombre = ? ");
  }
  if (apellido) {
    params.push(apellido);
    modi.push(" apellido = ? ");
  }
  if (url_perfil) {
    params.push(url_perfil);
    modi.push(" url_perfil = ? ");
  }
  if (nacimiento) {
    params.push(nacimiento);
    modi.push(" nacimiento = ? ");
  }
  if (correo) {
    params.push(correo);
    modi.push(" correo = ? ");
  }
  if (nacionalidad) {
    params.push(nacionalidad);
    modi.push(" nacionalidad = ? ");
  }
  if (contrasena) {
    params.push(contrasena);
    modi.push(" contrasena = ? ");
  }
  if (biografia) {
    params.push(biografia);
    modi.push(" biografia = ? ");
  }
  if (admin) {
    params.push(admin);
    modi.push(" admin = ? ");
  }

  sql += modi.toString() + "WHERE usuario_id = " + usuario_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de usuarios actualizados");
    }
    response.send(result);
  });
});

app.delete("/usuarios", function (req, res) {
  let sql4 = `DELETE FROM usuarios WHERE usuario_id=${req.body.usuario_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// ENDOINT JUEGOS //

app.get("/juegos/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT * FROM juegos WHERE juego_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.get("/juegos", function (req, res) {
  id = req.params.id;
  let sql1 = "SELECT * FROM juegos";
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/juegos", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO juegos (juego_id, nombre, foto) VALUES(null, \"${req.body.nombre}\", \"${req.body.foto}\")`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/juegos", function (req, response) {
  let juego_id = req.body.juego_id;
  let nombre = req.body.nombre;
  let foto = req.body.foto;

  let sql = "UPDATE juegos SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);

  if (nombre) {
    params.push(nombre);
    modi.push(" nombre = ? ");
  }
  if (foto) {
    params.push(foto);
    modi.push(" foto = ? ");
  }

  sql += modi.toString() + "WHERE juego_id = " + juego_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de juegos actualizados");
    }
    response.send(result);
  });
});

app.delete("/juegos", function (req, res) {
  let sql4 = `DELETE FROM juegos WHERE juego_id=${req.body.juego_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// ENDPOINT CHAT //

app.get("/chat/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT * FROM chat WHERE chat_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.get("/chat", function (req, res) {
  id = req.params.id;
  let sql1 = "SELECT * FROM chat";
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/chat", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO chat (chat_id, partido_id, capitan_first, capitan_second) VALUES(null, ${req.body.partido_id}, ${req.body.capitan_first}, ${req.body.capitan_second})`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/chat_id", function (req, response) {
  let chat_id = req.body.chat_id;
  let partido_id = req.body.partido_id;
  let capitan_first = req.capitan_first;
  let capitan_second = req.capitan_second;

  let sql = "UPDATE chat_id SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);

  if (partido_id) {
    params.push(partido_id);
    modi.push(" partido_id = ? ");
  }
  if (capitan_first) {
    params.push(capitan_first);
    modi.push(" capitan_first = ? ");
  }

  if (capitan_second) {
    params.push(capitan_second);
    modi.push(" capitan_second = ? ");
  }

  sql += modi.toString() + "WHERE chat_id = " + chat_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de chat actualizados");
    }
    response.send(result);
  });
});

app.delete("/chat", function (req, res) {
  let sql4 = `DELETE FROM chat WHERE chat_id=${req.body.chat_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// ENDPOINT MENSAJES //

app.get("/mensajes/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT * FROM mensajes WHERE mensaje_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.get("/mensajes", function (req, res) {
  id = req.params.id;
  let sql1 = "SELECT * FROM mensajes";
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/mensajes", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO chat (mensaje_id, chat_id, usuario_id, mensaje) VALUES(null, ${req.body.chat_id}, ${req.body.usuario_id}, \"${req.body.mensaje}\")`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/mensajes", function (req, response) {
  let mensaje_id = req.body.mensaje_id;
  let chat_id = req.body.chat_id;
  let usuario_id = req.usuario_id;
  let mensaje = req.mensaje;

  let sql = "UPDATE mensaje_id SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);

  if (chat_id) {
    params.push(chat_id);
    modi.push(" chat_id = ? ");
  }
  if (usuario_id) {
    params.push(usuario_id);
    modi.push(" usuario_id = ? ");
  }

  if (mensaje) {
    params.push(mensaje);
    modi.push(" mensaje = ? ");
  }

  sql += modi.toString() + "WHERE mensaje_id = " + mensaje_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de mensaje actualizados");
    }
    response.send(result);
  });
});

app.delete("/mensajes", function (req, res) {
  let sql4 = `DELETE FROM mensajes WHERE mensaje_id=${req.body.mensaje_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// ENDPOINT REGLAS //

app.get("/reglas/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT * FROM reglas WHERE reglas_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.get("/reglas", function (req, res) {
  id = req.params.id;
  let sql1 = "SELECT DISTINCT reglas.*, juegos.juego_id, juegos.nombre AS nombre_juego, juegos.foto AS foto_juego FROM reglas LEFT JOIN juegos ON (reglas.juego_id = juegos.juego_id)";
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/reglas", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO reglas (reglas_id, modo, juego_id, descripcion) VALUES(null, \'${req.body.modo}\', ${req.body.juego_id}, \'${req.body.descripcion}\')`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/reglas", function (req, response) {
  let reglas_id = req.body.reglas_id;
  let modo = req.body.modo;
  let juego_id = req.body.juego_id;
  let descripcion = req.body.descripcion;
  let sql = "UPDATE reglas SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);
  if (modo) {
    params.push(modo);
    modi.push(" modo = ? ");
  }
  if (juego_id) {
    params.push(juego_id);
    modi.push(" juego_id = ? ");
  }
  if (descripcion) {
    params.push(descripcion);
    modi.push(" descripcion = ? ");
  }
  console.log(params);
  console.log(modi);
  sql += modi.toString() + "WHERE reglas_id = " + reglas_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de usuarios actualizados");
    }
    response.send(result);
  });
});

app.delete("/reglas", function (req, res) {
  let sql4 = `DELETE FROM reglas WHERE reglas_id=${req.body.reglas_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// ENDPOINT EQUIPOS //

app.get("/admin-equipos", function (req, res) {
  id = req.params.id;
  let sql = "SELECT DISTINCT e.equipo_id, e.logo, e.nombre, e.juego_id, juegos.nombre AS juego_nombre, juegos.foto AS juego_foto, e.capitan, e.ganadas, e.perdidas, e.empatadas, e.jugadas FROM equipo_usuario INNER JOIN equipos AS e ON(equipo_usuario.equipo_id = e.equipo_id) INNER JOIN juegos ON (e.juego_id = juegos.juego_id)"
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.put("/admin-equipos", function (req, response) {
  let equipo_id = req.body.equipo_id;
  let nombre = req.body.nombre;
  let juego_id = req.body.juego_id;
  let capitan = req.body.capitan;
  let ganadas = req.body.ganadas;
  let perdidas = req.body.perdidas;
  let jugadas = req.body.jugadas;
  let biografia = req.body.biografia;
  let puntuacion = req.body.puntuacion

  let sql = "UPDATE equipos SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);

  if (nombre) {
    params.push(nombre);
    modi.push(" nombre = ? ");
  }
  if (juego_id) {
    params.push(juego_id);
    modi.push(" juego_id = ? ");
  }
  if (capitan) {
    params.push(capitan);
    modi.push(" capitan = ? ");
  }
  if (ganadas) {
    params.push(ganadas);
    modi.push(" ganadas = ? ");
  }
  if (perdidas) {
    params.push(perdidas);
    modi.push(" perdidas = ? ");
  }
  if (jugadas) {
    params.push(jugadas)
    modi.push(" jugadas = ? ")
  }
  if (biografia) {
    params.push(biografia)
    modi.push(" biografia = ? ")
  }
  if (puntuacion) {
    params.push(puntuacion)
    modi.push(" puntuacion = ? ")
  }

  sql += modi.toString() + "WHERE equipo_id= " + equipo_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de EQUIPOS actualizados");
    }
    response.send(result);
  });
});

app.delete("/admin-equipos", function (req, res) {
  let sql4 = `DELETE FROM equipos WHERE equipo_id=${req.body.equipo_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});


// ENDPOINT JUEGOS
app.get("/juegosall", function (req, res) {
  let sql = "SELECT DISTINCT e.juego_id, e.nombre AS juego_nombre, e.foto FROM juegos LEFT JOIN juegos AS e ON (juegos.juego_id = juegos.juego_id)";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result)
  })
})

app.get("/torneosall", function (req, res) {
  let sql = "SELECT DISTINCT e.* FROM torneos LEFT JOIN torneos AS e ON (torneos.torneo_id = torneos.torneo_id)";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result)
  })
})


// ENDPOINT PARTIDOS 
app.get("/admin-equipos-torneos/:id", function (req, res) {
  let id = req.params.id;
  let sql = "SELECT torneos.torneo_id, equipos.equipo_id, equipos.nombre, equipos.logo FROM equipos_torneos LEFT JOIN torneos ON(equipos_torneos.torneo_id = torneos.torneo_id) LEFT JOIN equipos ON (equipos_torneos.equipo_id = equipos.equipo_id) WHERE torneos.torneo_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.get("/admin-torneos-all", function (req, res) {
  let id = req.params.id;
  let sql = "SELECT DISTINCT torneos.torneo_id, torneos.nombre, juegos.juego_id, juegos.nombre AS juego_nombre, torneos.fases, torneos.fecha, torneos.hora, torneos.estado, torneos.puntos, reglas.reglas_id, reglas.modo AS reglas_modo FROM torneos LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id) LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id)"
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.post("/admin-torneos-all", function (req, res) {
  const estado = "ACTIVO"
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO torneos (torneo_id, nombre, fecha, fases, reglas_id, game_id, hora, puntos, estado) VALUES(null, \"${req.body.nombre}\", \"${req.body.fecha}\", \"${req.body.fases}\", ${req.body.reglas_id}, ${req.body.game_id}, \"${req.body.hora}\", ${req.body.puntos}, \"${estado}\")`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/admin-torneos-all", function (req, response) {
  let torneo_id = req.body.torneo_id;
  let nombre = req.body.nombre;
  let fecha = req.body.fecha;
  let fases = req.body.fases;
  let reglas_id = req.body.reglas_id;
  let game_id = req.body.game_id;
  let hora = req.body.hora;
  let puntos = req.body.puntos;
  let estado = req.body.estado;

  let sql = "UPDATE torneos SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);

  if (nombre) {
    params.push(nombre);
    modi.push(" nombre = ? ");
  }
  if (fecha) {
    params.push(fecha);
    modi.push(" fecha = ? ");
  }
  if (fases) {
    params.push(fases);
    modi.push(" fases = ? ");
  }
  if (reglas_id) {
    params.push(reglas_id);
    modi.push(" reglas_id = ? ");
  }
  if (game_id) {
    params.push(game_id);
    modi.push(" game_id = ? ");
  }
  if (hora) {
    params.push(hora)
    modi.push(" hora = ? ")
  }
  if (puntos) {
    params.push(puntos)
    modi.push(" puntos = ? ")
  }
  if (estado) {
    params.push(estado)
    modi.push(" estado = ? ")
  }

  sql += modi.toString() + "WHERE torneo_id= " + torneo_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de TORNEOS actualizados");
    }
    response.send(result);
  });
});

app.delete("/admin-torneos-all", function (req, res) {
  let sql4 = `DELETE FROM torneos WHERE torneo_id=${req.body.torneo_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// obtener listado de partidas de un usuario

app.get("/mis-partidas", function (req, res) {
  id = req.query.id;
  let sql = "SELECT DISTINCT partidos.partido_id, torneos.torneo_id, torneos.nombre AS torneo_nombre, juegos.juego_id, juegos.nombre AS juego_nombre, juegos.foto, torneos.fecha, torneos.fases, torneos.hora, torneos.puntos, torneos.estado, e.equipo_id AS first_equipo_id, e.nombre AS first_equipo_nombre, e.logo AS first_equipo_logo, e1.equipo_id as second_equipo_id, e1.nombre AS second_equipo_nombre, e1.logo AS second_equipo_logo" +
    " FROM partidos LEFT JOIN torneos ON (partidos.torneo_id = torneos.torneo_id)" +
    " LEFT JOIN juegos ON (partidos.juego_id = juegos.juego_id)" +
    " LEFT JOIN equipos AS e ON (partidos.equipo_first = e.equipo_id)" +
    " LEFT JOIN equipos AS e1 ON (partidos.equipo_second = e1.equipo_id)" +
    " WHERE e1.equipo_id =" + id + " OR e.equipo_id =" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.get("/mis-torneos", function (req, res) {
  id = req.query.id;
  let sql = "SELECT torneos.torneo_id, torneos.nombre, torneos.fecha, torneos.fases, torneos.hora, torneos.puntos, torneos.estado, juegos.juego_id, juegos.nombre AS juego_nombre, reglas.reglas_id, reglas.modo AS reglas_modo, equipos.equipo_id, equipos.nombre AS equipo_nombre, equipos.logo AS equipo_logo FROM equipos_torneos LEFT JOIN torneos ON (equipos_torneos.torneo_id = torneos.torneo_id) LEFT JOIN equipos ON (equipos_torneos.equipo_id = equipos.equipo_id) LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id) LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id) WHERE equipos.equipo_id =" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

// app.get("/mis-partidas", function (req, res) {
//   id = req.query.id;
//   let sql = "SELECT torneos.nombre, torneos.juego, torneos.fecha, torneos.hora, torneos.puntos, torneos.estado FROM torneos INNER JOIN equipos_torneos ON (torneos.torneo_id = equipos_torneos.torneo_id) INNER JOIN equipo_usuario ON (equipos_torneos.equipo_id = equipo_usuario.equipo_id) INNER JOIN usuarios ON (equipo_usuario.usuario_id = usuarios.usuario_id) WHERE usuarios.usuario_id =" + id;
//   connection.query(sql, function (err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//     }

//     res.send(result);
//   });


app.get("/admin-partidos", function (req, res) {
  id = req.params.id;
  let sql = "SELECT DISTINCT partidos.partido_id, torneos.torneo_id, torneos.fases, torneos.nombre AS torneo_nombre, torneos.estado AS estado_torneo, juegos.juego_id, juegos.nombre AS juego_nombre, juegos.foto AS juego_foto, partidos.fecha, partidos.hora, partidos.equipo_first, e1.nombre AS nombre_equipo_first,e1.logo AS logo_first, partidos.equipo_second, e2.nombre AS nombre_equipo_second, e2.logo AS logo_second,partidos.resultado_first, partidos.resultado_second, partidos.comentario FROM partidos LEFT JOIN juegos ON (partidos.juego_id = juegos.juego_id) LEFT JOIN equipos AS e1 ON (partidos.equipo_first = e1.equipo_id) LEFT JOIN equipos AS e2 ON (partidos.equipo_second = e2.equipo_id) LEFT JOIN torneos ON (partidos.torneo_id = torneos.torneo_id)"
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

app.post("/admin-partidos", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO partidos (partido_id, torneo_id, juego_id, fecha, hora, equipo_first, equipo_second, resultado_first, resultado_second, comentario) VALUES(null, ${req.body.torneo_id}, ${req.body.juego_id}, \"${req.body.fecha}\", \"${req.body.hora}\", ${req.body.equipo_first}, ${req.body.equipo_second}, ${req.body.resultado_first}, ${req.body.resultado_second}, \"${req.body.comentario}\")`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/admin-partidos", function (req, response) {
  let partido_id = req.body.partido_id;
  let torneo_id = req.body.torneo_id;
  let juego_id = req.body.juego_id;
  let fecha = req.body.fecha;
  let hora = req.body.hora;
  let equipo_first = req.body.equipo_first;
  let equipo_second = req.body.equipo_second;
  let resultado_first = req.body.resultado_first;
  let resultado_second = req.body.resultado_second
  let comentario = req.body.comentario

  let sql = "UPDATE partidos SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);

  if (torneo_id) {
    params.push(torneo_id);
    modi.push(" torneo_id = ? ");
  }
  if (juego_id) {
    params.push(juego_id);
    modi.push(" juego_id = ? ");
  }
  if (fecha) {
    params.push(fecha);
    modi.push(" fecha = ? ");
  }
  if (hora) {
    params.push(hora);
    modi.push(" hora = ? ");
  }
  if (equipo_first) {
    params.push(equipo_first);
    modi.push(" equipo_first = ? ");
  }
  if (equipo_second) {
    params.push(equipo_second)
    modi.push(" equipo_second = ? ")
  }
  if (resultado_first) {
    params.push(resultado_first)
    modi.push(" resultado_first = ? ")
  }
  if (resultado_second) {
    params.push(resultado_second)
    modi.push(" resultado_second = ? ")
  }
  if (comentario) {
    params.push(comentario)
    modi.push(" comentario = ? ")
  }

  sql += modi.toString() + "WHERE partido_id= " + partido_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de EQUIPOS actualizados");
    }
    response.send(result);
  });
});

app.delete("/admin-partidos", function (req, res) {
  let sql4 = `DELETE FROM partidos WHERE partido_id=${req.body.partido_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});
// FIN

app.get("/admin-equipo/:nombre", function (req, res) {
  id = req.params.id
  nombre = req.params.nombre
  let arr = [id, nombre]
  let sql = `SELECT * FROM equipos WHERE nombre = \"${nombre}\"`
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result)
  })
})

// ENDPOINT PARTIDOS //


// app.get("/partidos/:id", function (req, res) {
//   id = req.params.id;
//   let sql = "SELECT * FROM partidos WHERE partido_id=" + id;
//   connection.query(sql, function (err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//     }

//     res.send(result);
//   });
// });

app.get("/partidos", function (req, res) {
  id = req.params.id;
  let sql1 = "SELECT * FROM partidos";
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.post("/partidos", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql2 = `INSERT INTO partidos (partido_id, torneo_id, equipo_first, equipo_second, resultado_first, resultado_second) VALUES(null, ${req.body.torneo_id}, ${req.body.equipo_first}, ${req.body.equipo_second}, ${req.body.resultado_first}, ${req.body.resultado_second})`;
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/partidos", function (req, response) {
  let partido_id = req.body.partido_id;
  let torneo_id = req.body.torneo_id;
  let equipo_first = req.equipo_first;
  let equipo_second = req.equipo_second;
  let resultado_first = req.resultado_first;
  let resultado_second = req.resultado_second;

  let sql = "UPDATE reglas_id SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);

  if (torneo_id) {
    params.push(torneo_id);
    modi.push(" torneo_id = ? ");
  }
  if (equipo_first) {
    params.push(equipo_first);
    modi.push(" equipo_first = ? ");
  }
  if (equipo_second) {
    params.push(equipo_second);
    modi.push(" equipo_second = ? ");
  }
  if (resultado_first) {
    params.push(resultado_first);
    modi.push(" resultado_first = ? ");
  }
  if (resultado_second) {
    params.push(resultado_second);
    modi.push(" resultado_second = ? ");
  }

  sql += modi.toString() + "WHERE partido_id= " + partido_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de PARTIDOS actualizados");
    }
    response.send(result);
  });
});

app.delete("/partidos", function (req, res) {
  let sql4 = `DELETE FROM partidos WHERE partido_id=${req.body.partido_id}`;
  connection.query(sql4, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// Muestra todos los equipos de la bbdd

app.get("/equipos", function (req, res) {
  id = req.params.id;
  let sql = "SELECT * FROM equipos";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

// Muestra el equipo pasado por id

app.get("/equipo", function (req, res) {
  id = req.query.id;
  let sql = "SELECT DISTINCT e.*, usuarios.usuario_id AS capitan_id, usuarios.nickname AS nickname_capitan, torneos.estado FROM equipo_usuario JOIN equipos AS e ON(equipo_usuario.equipo_id = e.equipo_id) JOIN usuarios ON (e.capitan = usuarios.usuario_id) JOIN juegos ON (e.juego_id = juegos.juego_id) LEFT JOIN equipos_torneos ON (equipo_usuario.equipo_id = equipos_torneos.equipo_id) LEFT JOIN torneos ON (equipos_torneos.torneo_id = torneos.torneo_id) WHERE e.equipo_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

// Muestra los equipos a los que pertenece un usuario.

app.get("/equipos/:id", function (req, res) {
  id = req.params.id;
  let arr = [id];
  let sql2 = "SELECT equipos.nombre, logo, usuarios.url_perfil FROM equipos INNER JOIN equipo_usuario ON (equipos.equipo_id = equipo_usuario.equipo_id) INNER JOIN usuarios ON (equipo_usuario.usuario_id = usuarios.usuario_id) WHERE equipos.equipo_id = ?";
  // let sql = "SELECT nombre, logo FROM equipos INNER JOIN equipo_usuario ON (equipos.equipo_id = equipo_usuario.equipo_id) WHERE usuario_id = ?";
  connection.query(sql2, arr, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result)
    }
  });
});



// app.get("/equipos/equipo_id/:id", function (req, res) {
//   id = req.params.id;
//   let sql = `SELECT * FROM equipos WHERE nickname=\"${req.params.id}\"`;
//   connection.query(sql, function (err, result) {
//     let resultado;
//     if (err) {
//       console.log(err);
//     } else {
//       var string = JSON.stringify(result);
//       var json = JSON.parse(string);
//       let x = json.find((id) => id === id);
//       if (x === undefined) {
//         resultado = false;
//         console.log(false);
//       } else {
//         resultado = true;
//         console.log(true);
//       }
//     }
//     res.send(result);
//   });
// });

// POST equipos (añade un nuevo equipo a la base de datos).

app.post("/equipos", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql = `INSERT INTO equipos (equipo_id, nombre, logo, juego_id, capitan, ganadas, perdidas, jugadas, biografia) VALUES(null, \"${req.body.nombre}\", \"${req.body.logo}\", \"${req.body.juego_id}\",\"${req.body.capitan}\",\"${req.body.ganadas}\",\"${req.body.perdidas}\",\"${req.body.jugadas}\",\"${req.body.biografia}\")`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result)
    });
  }
});


app.post("/equipo-usuario", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql = `INSERT INTO equipo_usuario (usuario_id, equipo_id) VALUES(${req.body.usuario_id}, ${req.body.equipo_id})`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

// PUT equipos (modifica la información de un equipo de la base de datos).

app.put("/equipos", function (req, response) {
  let equipo_id = req.body.equipo_id;
  let nombre = req.body.nombre;
  let logo = req.body.logo;
  let juego_id = req.body.juego_id;
  let capitan = req.body.capitan;
  let ganadas = req.body.ganadas;
  let perdidas = req.body.perdidas;
  let jugadas = req.body.jugadas;
  let biografia = req.body.biografia;
  let sql = "UPDATE equipos SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);
  if (nombre) {
    params.push(nombre);
    modi.push(" nombre = ? ");
  }
  if (logo) {
    params.push(logo);
    modi.push(" logo = ? ");
  }
  if (juego_id) {
    params.push(juego_id);
    modi.push(" juego_id = ? ");
  }
  if (capitan) {
    params.push(capitan);
    modi.push(" capitan = ? ");
  }
  if (ganadas) {
    params.push(ganadas);
    modi.push(" ganadas = ? ");
  }
  if (perdidas) {
    params.push(perdidas);
    modi.push(" perdidas = ? ");
  }
  if (jugadas) {
    params.push(jugadas);
    modi.push(" jugadas = ? ");
  }
  if (biografia) {
    params.push(biografia);
    modi.push(" biografia = ? ");
  }

  sql += modi.toString() + "WHERE equipo_id = " + equipo_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos del equipo actualizados");
    }
    response.send(result);
  });
});

// Delete equipo

app.delete("/equipos", function (req, res) {
  let sql = `DELETE FROM equipos WHERE equipo_id=${req.body.equipo_id}`;
  connection.query(sql, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});

// Muestra todos los torneos de la bbdd

// Nuevo: se agrego un Join para obtener los datos de los equipos en el torneo
app.get("/torneos", function (req, res) {
  id = req.params.id;
  let sql = "SELECT torneos.torneo_id, torneos.nombre, torneos.fecha, torneos.fases, torneos.reglas_id, torneos.game_id, torneos.hora, torneos.puntos, torneos.estado, j.juego_id, j.nombre as juego_nombre, j.foto AS logo_juego, r.reglas_id, r.modo AS modo_regla, r.juego_id, r.descripcion AS descripcion_regla FROM torneos INNER JOIN juegos j on torneos.game_id = j.juego_id INNER JOIN reglas r on torneos.reglas_id = r.reglas_id";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

// Muestra el torneo pasado por id

app.get("/torneos/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT * FROM torneos WHERE torneo_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

// Mostrar los torneos en los que está inscrito un usuario

// Nuevo: corregir consulta, el campo resultado no existe
app.get("/torneo", function (req, res) {
  id = req.query.id;
  let sql = "SELECT torneos.torneo_id, torneos.nombre, torneos.fecha, torneos.fases, torneos.hora, torneos.puntos, torneos.estado, juegos.juego_id, juegos.nombre AS juego_nombre, reglas.reglas_id, reglas.modo AS reglas_modo, equipos.equipo_id, equipos.nombre AS equipo_nombre, equipos.logo AS equipo_logo FROM equipos_torneos LEFT JOIN torneos ON (equipos_torneos.torneo_id = torneos.torneo_id) LEFT JOIN equipos ON (equipos_torneos.equipo_id = equipos.equipo_id) LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id) LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id) LEFT JOIN usuarios u on equipos.capitan = u.usuario_id WHERE u.usuario_id =" + id + " GROUP BY torneos.nombre";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

// Mostrar los torneos de un equipo pasado por query

// app.get("/torneo", function (req, res) {
//   id = req.query.id;
//   let sql = "SELECT * FROM torneos WHERE torneo_id=" + id;
//   connection.query(sql, function (err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//     }
//     res.send(result);
//   });
// });

// POST torneos (añade un nuevo torneo a la base de datos).

app.post("/torneos", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql = `INSERT INTO torneos (torneo_id, nombre, juego, fecha, fases, reglas_id, hora, puntos, resultado) VALUES(null, \"${req.body.nombre}\", \"${req.body.juego}\", \"${req.body.fecha}\", \"${req.body.fases}\",\"${req.body.reglas_id}\",\"${req.body.hora}\", \"${req.body.puntos}\", \"${req.body.resultado}\")`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

// PUT torneos (modifica la información de un torneo de la base de datos).

app.put("/torneos", function (req, response) {
  let torneo_id = req.body.torneo_id;
  let nombre = req.body.nombre;
  let juego = req.body.juego;
  let fecha = req.body.fecha;
  let fases = req.body.fases;
  let reglas_id = req.body.reglas_id;
  let hora = req.body.hora;
  let puntos = req.body.puntos;
  let resultado = req.body.resultado;
  let sql = "UPDATE torneos SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);
  if (nombre) {
    params.push(nombre);
    modi.push(" nombre = ? ");
  }
  if (juego) {
    params.push(juego);
    modi.push(" juego = ? ");
  }
  if (fecha) {
    params.push(fecha);
    modi.push(" fecha = ? ");
  }
  if (fases) {
    params.push(fases);
    modi.push(" fases = ? ");
  }
  if (reglas_id) {
    params.push(reglas_id);
    modi.push(" reglas_id = ? ");
  }
  if (hora) {
    params.push(hora);
    modi.push(" hora = ? ");
  }
  if (puntos) {
    params.push(puntos);
    modi.push(" puntos = ? ");
  }
  if (resultado) {
    params.push(resultado);
    modi.push(" resultado = ? ");
  }

  sql += modi.toString() + "WHERE torneo_id = " + torneo_id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos del torneo actualizados");
    }
    response.send(result);
  });
});

// Elimina un torneo pasado por id

app.delete("/torneos", function (req, res) {
  let sql = `DELETE FROM torneos WHERE torneo_id=${req.body.torneo_id}`;
  connection.query(sql, function (err, result) {
    let msg;
    if (err) {
      console.log(err);
      msg = true
    } else {
      msg = result
      console.log(result);
    }
    res.send(msg);
  });
});


// ENDPOINTS COLOCACION TORNEO

app.post("/colocacion", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql = `INSERT INTO colocacion_torneo (torneo_id, equipo_id, posicion) VALUES(\"${req.body.torneo_id}\", \"${req.body.equipo_id}\", \"${req.body.posicion}\")`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result);
    });
  }
});

app.put("/colocacion", function (req, response) {
  let id = req.body.id;
  let torneo_id = req.body.torneo_id;
  let equipo_id = req.body.equipo_id;
  let posicion = req.body.posicion;
  let sql = "UPDATE colocacion_torneo SET";
  let params = new Array();
  let modi = new Array();
  console.log(req.body);
  if (torneo_id) {
    params.push(torneo_id);
    modi.push(" torneo_id = ? ");
  }
  if (equipo_id) {
    params.push(equipo_id);
    modi.push(" equipo_id = ? ");
  }
  if (posicion) {
    params.push(posicion);
    modi.push(" posicion = ? ");
  }

  sql += modi.toString() + "WHERE id = " + id;
  console.log(sql);
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Datos de la colocacion actualizados");
    }
    response.send(result);
  });
});

app.get("/colocacion", function (req, res) {
  id = req.query.id;
  let sql = "SELECT DISTINCT colocacion_torneo.posicion, logo, nombre, resultado_first, resultado_second" +
    " FROM colocacion_torneo LEFT JOIN equipos ON (colocacion_torneo.equipo_id = equipos.equipo_id)" +
    " LEFT JOIN partidos ON (partidos.equipo_first = equipos.equipo_id)" +
    " WHERE colocacion_torneo.torneo_id = " + id +
    " ORDER BY colocacion_torneo.posicion ASC";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.get("/colocacionPar", function (req, res) {
  id = req.query.id;
  let sql = "SELECT colocacion_torneo.posicion, logo, nombre, resultado_second " +
    "FROM colocacion_torneo INNER JOIN equipos ON (colocacion_torneo.equipo_id = equipos.equipo_id) " +
    "LEFT JOIN partidos ON (partidos.equipo_first = equipos.equipo_id) " +
    "WHERE colocacion_torneo.torneo_id = " + id; +
      " ORDER BY colocacion_torneo.posicion ASC";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

app.get("/colocacionImpar", function (req, res) {
  id = req.query.id;
  let sql = "SELECT colocacion_torneo.posicion, logo, nombre, resultado_first " +
    "FROM colocacion_torneo INNER JOIN equipos ON (colocacion_torneo.equipo_id = equipos.equipo_id) " +
    "LEFT JOIN partidos ON (partidos.equipo_first = equipos.equipo_id) " +
    "WHERE colocacion_torneo.torneo_id = " + id; +
      " ORDER BY colocacion_torneo.posicion ASC";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

// HOME
app.get("/home", function (req, res) {
  let sql = "SELECT torneos.torneo_id, torneos.nombre, torneos.fecha, torneos.fases, reglas.reglas_id, reglas.modo AS modo_regla, reglas.descripcion AS descripcion_regla, juegos.juego_id, juegos.nombre AS juego_nombre, juegos.foto AS logo_juego,torneos.hora, torneos.puntos, torneos.estado FROM torneos LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id) LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id)"
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result)
  })
})
// FIN HOME 


app.get("/gethome", function (req, res) {
  id = req.query.game
  estado = req.query.estado
  if (id && !estado) {
    console.log("existe game");
    let sql = `SELECT torneos.torneo_id, torneos.nombre, torneos.fecha, torneos.fases, reglas.reglas_id, reglas.modo AS modo_regla, reglas.descripcion AS reglas_descripcion, juegos.juego_id, juegos.nombre AS juego_nombre, juegos.foto AS logo_juego,torneos.hora, torneos.puntos, torneos.estado FROM torneos LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id) LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id) WHERE juegos.juego_id=${id}`
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result)
    })
  }
  if (!id && estado) {
    console.log("solo estado");
    let sql = `SELECT torneos.torneo_id, torneos.nombre, torneos.fecha, torneos.fases, reglas.reglas_id, reglas.modo AS modo_regla, reglas.descripcion AS reglas_descripcion, juegos.juego_id, juegos.nombre AS juego_nombre, juegos.foto AS logo_juego,torneos.hora, torneos.puntos, torneos.estado FROM torneos LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id) LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id) WHERE torneos.estado=\"${estado}\"`
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result)
    })
  }
  if (id && estado) {
    console.log("EXISTE GAME Y TODO");
    let sql = `SELECT torneos.torneo_id, torneos.nombre, torneos.fecha, torneos.fases, reglas.reglas_id, reglas.modo AS modo_regla, reglas.descripcion AS reglas_descripcion, juegos.juego_id, juegos.nombre AS juego_nombre, juegos.foto AS logo_juego,torneos.hora, torneos.puntos, torneos.estado FROM torneos LEFT JOIN juegos ON (torneos.game_id = juegos.juego_id) LEFT JOIN reglas ON (torneos.reglas_id = reglas.reglas_id) WHERE juegos.juego_id=${id} AND torneos.estado=\"${estado}\"`
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      res.send(result)
    })
  }

})


//FUNCIONALIDADES NUEVAS 

// Nuevo: se agrego la relación de los equipos para obtener el nombre y foto
app.get("/partidos/:id", function (req, res) {
  id = req.params.id;
  let sql = "SELECT partidos.partido_id,partidos.torneo_id,partidos.juego_id,partidos.fecha,partidos.hora,partidos.equipo_first,partidos.equipo_second,partidos.resultado_first,partidos.resultado_second,partidos.comentario,partidos.posicion,partidos.finalizado,partidos.fase,e1.equipo_id,e1.nombre as nombre_first,e1.logo as logo_first,e2.equipo_id,e2.nombre as nombre_second,e2.logo as logo_second, e1.capitan as capitan_first, e2.capitan as capitan_second FROM partidos INNER JOIN equipos e1 on partidos.equipo_first = e1.equipo_id INNER JOIN equipos e2 on partidos.equipo_second = e2.equipo_id WHERE partido_id=" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }

    res.send(result);
  });
});

// Nuevo: nuevo endpoint para recuperar la lista de partidos por fase en un torneo
app.get("/partidos-torneo/:torneo_id", function (req, res) {
  id = req.params.torneo_id;
  let sql = "SELECT partidos.partido_id,torneos.torneo_id,torneos.nombre,partidos.juego_id,partidos.fecha,partidos.hora,partidos.equipo_first,partidos.equipo_second,partidos.resultado_first,partidos.resultado_second,partidos.comentario,partidos.posicion,partidos.finalizado,partidos.fase,e1.equipo_id,e1.nombre as nombre_first,e1.logo as logo_first,e2.equipo_id,e2.nombre as nombre_second,e2.logo as logo_second FROM partidos INNER JOIN equipos e1 on partidos.equipo_first = e1.equipo_id INNER JOIN equipos e2 on partidos.equipo_second = e2.equipo_id INNER JOIN torneos on partidos.torneo_id = torneos.torneo_id WHERE partidos.torneo_id =" + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    const nombre = []
    const dieciseisList = []
    const octavoList = []
    const cuartoList = []
    const semiList = []
    const finalList = []

    result.forEach(item => {
      if (item.nombre) {
        nombre.push(item)
      }
      if (item.fase === FASES.dieciseisavos) {
        dieciseisList.push(item)
      }
      if (item.fase === FASES.octavos) {
        octavoList.push(item)
      }
      if (item.fase === FASES.cuartos) {
        cuartoList.push(item)
      }
      if (item.fase === FASES.semifinal) {
        semiList.push(item)
      }
      if (item.fase === FASES.final) {
        finalList.push(item)
      }
      // if(item.finalizado === 1 && item.fase === "final"){}
    })

    result = {
      nombre,
      dieciseisList,
      octavoList,
      cuartoList,
      semiList,
      finalList
    }

    res.send(result);
  });
});

// Nuevo: para actualizar los resultados partidos, también se agrega un nuevo partido para la siguiente fase
app.put("/partidos-resultados", function (req, res) {
  const partido_id = req.body.partido_id;
  const resultado_first = req.body.resultado_first;
  const resultado_second = req.body.resultado_second;

  let sql = "UPDATE partidos SET resultado_first = ?, resultado_second = ?, finalizado = 1 WHERE partido_id= " + partido_id;
  const params = [resultado_first, resultado_second]
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let sqlPartidos = `SELECT partidos.partido_id,partidos.torneo_id,partidos.juego_id,partidos.fecha,partidos.hora,partidos.equipo_first,partidos.equipo_second,partidos.resultado_first,partidos.resultado_second,partidos.comentario,partidos.posicion,partidos.finalizado,partidos.fase,e1.equipo_id,e1.nombre as nombre_first,e1.logo,e2.equipo_id,e2.nombre as nombre_second,e2.logo FROM partidos INNER JOIN equipos e1 on partidos.equipo_first = e1.equipo_id INNER JOIN equipos e2 on partidos.equipo_second = e2.equipo_id WHERE torneo_id = ${req.body.torneo_id} AND fase = '${req.body.fase}'`
      connection.query(sqlPartidos, function (err, partidosResult) {
        if (err) {
          res.status(400);
          res.send(err)
        }

        const partidos = partidosResult.filter(item => item.posicion === req.body.posicion && item.finalizado === 1)

        const finalizado = partidosResult.filter(item => item.finalizado === 1 && item.fase === "final")


        if (finalizado != undefined || finalizado != null) {

          // console.log(finalizado.torneo_id);
          let sqlfinalizado = `UPDATE torneos SET estado="FINALIZADO" WHERE torneo_id = ${req.body.torneo_id}`
          connection.query(sqlfinalizado, function (err, result) {
            if (err) {
              console.log(err);
            }
            else {
              console.log(result);
              const array = []
              const array2 = []
              let sqlPuntos = `SELECT partidos.*, torneos.puntos FROM partidos INNER JOIN torneos ON partidos.torneo_id = torneos.torneo_id WHERE partidos.torneo_id = ${req.body.torneo_id} AND partidos.fase = "final" AND partidos.finalizado = 1`
              console.log(sqlPuntos);
              connection.query(sqlPuntos, function (err, resultFin) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(JSON.stringify(resultFin));
                  resultFin.forEach(element => {
                    let item_1 = { "equipo_first": element.equipo_first, "resultado_first": element.resultado_first };
                    let item_2 = { "equipo_second": element.equipo_second, "resultado_second": element.resultado_second };
                    let max = Math.max(element.resultado_first, element.resultado_second)
                    array.push(item_1, item_2)
                    for (let i = 0; i < array.length; i++) {
                      if (array[i].resultado_first === max || array[i].resultado_second === max) {
                        array2.push(array[i].equipo_first, array[i].equipo_second)
                        console.log(array2);
                        console.log(array[i].equipo_second);
                        const result = array2.filter(element => element != undefined);
                        const equipoID = result[0];
                        const puntosTorneo = element.puntos

                        let sql23 = `SELECT equipos.puntuacion FROM equipos WHERE equipo_id = ${equipoID}`
                        connection.query(sql23, function (err, resultD) {
                          if (err) {
                            console.log(err);
                          } else {
                            const puntuacionEquipo = resultD[0].puntuacion
                            const sumaTotal = puntuacionEquipo + puntosTorneo
                            console.log(sumaTotal);
                            let sqlUpdate = `UPDATE equipos SET puntuacion = ${sumaTotal} WHERE equipo_id = ${equipoID}`
                            connection.query(sqlUpdate, function (err, resultTotal) {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log(resultTotal);
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }

        if (partidos.length === 2) {
          let equipo_first = partidos[0].resultado_first > partidos[0].resultado_second ? partidos[0].equipo_first : partidos[0].equipo_second
          let equipo_second = partidos[1].resultado_first > partidos[1].resultado_second ? partidos[1].equipo_first : partidos[1].equipo_second

          let fase = FASES.dieciseisavos
          let posicion = 1

          if (req.body.fase === FASES.dieciseisavos) {
            fase = FASES.octavos

            if (req.body.posicion === 1 || req.body.posicion === 2) {
              posicion = 1
            }

            if (req.body.posicion === 3 || req.body.posicion === 4) {
              posicion = 2
            }

            if (req.body.posicion === 5 || req.body.posicion === 6) {
              posicion = 3
            }

            if (req.body.posicion === 7 || req.body.posicion === 8) {
              posicion = 4
            }

            if (req.body.posicion === 9 || req.body.posicion === 10) {
              posicion = 5
            }

            if (req.body.posicion === 11 || req.body.posicion === 12) {
              posicion = 6
            }

            if (req.body.posicion === 13 || req.body.posicion === 14) {
              posicion = 7
            }

            if (req.body.posicion === 15 || req.body.posicion === 16) {
              posicion = 8
            }
          }
          if (req.body.fase === FASES.octavos) {
            fase = FASES.cuartos

            if (req.body.posicion === 1 || req.body.posicion === 2) {
              posicion = 1
            }

            if (req.body.posicion === 3 || req.body.posicion === 4) {
              posicion = 2
            }

            if (req.body.posicion === 5 || req.body.posicion === 6) {
              posicion = 3
            }

            if (req.body.posicion === 7 || req.body.posicion === 8) {
              posicion = 4
            }
          }
          if (req.body.fase === FASES.cuartos) {
            fase = FASES.semifinal

            if (req.body.posicion === 1 || req.body.posicion === 2) {
              posicion = 1
            }

            if (req.body.posicion === 3 || req.body.posicion === 4) {
              posicion = 2
            }
          }
          if (req.body.fase === FASES.semifinal) {
            fase = FASES.final

            if (req.body.posicion === 1 || req.body.posicion === 2) {
              posicion = 1
            }
          }

          if(req.body.fase === FASES.final){
            console.log("Ay final");
          }

          const sqlPartidos = `INSERT INTO partidos (torneo_id, juego_id, fecha, equipo_first, equipo_second, resultado_first, resultado_second, comentario, posicion, fase)
                      VALUES(${req.body.torneo_id}, 1, NOW(), ?, ?, 0, 0, '', ?, ?)`;
          connection.query(sqlPartidos, [equipo_first, equipo_second, posicion, fase], function (err, resultPartido) {
            if (err) {
              res.status(400);
              res.send(err)
            } else {
              res.send(partidos);
            }
          });
          console.log("Datos de PARTIDOS actualizados");
        } else {
          res.send({ message: 'Datos de PARTIDOS actualizados', value: partidosResult });
        }
      })
    }
  });
});

// Nuevo: obtener equipos por usuario
app.get("/equipos-usuario", function (req, res) {
  const userId = req.query.userId;
  let arr = [userId];
  let sql2 = "SELECT equipos.nombre, equipos.equipo_id, equipos.nombre, equipos.logo, equipos.juego_id, equipos.capitan, equipos.ganadas, equipos.perdidas, equipos.empatadas, equipos.jugadas, equipos.biografia, equipos.puntuacion FROM equipos INNER JOIN equipo_usuario ON (equipos.equipo_id = equipo_usuario.equipo_id) INNER JOIN usuarios ON (equipo_usuario.usuario_id = usuarios.usuario_id) WHERE usuarios.usuario_id = ?";
  connection.query(sql2, arr, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

// Nuevo: agregar un equipo y agregar en la tabla equipo_usuario
app.post("/equipos", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql = `
    INSERT INTO equipos (equipo_id, nombre, logo, juego_id, capitan, ganadas, perdidas, empatadas, jugadas, biografia)
    VALUES(null, \"${req.body.nombre}\", \"${req.body.logo}\", \"${req.body.juego_id}\",\"${req.body.capitan}\",\"${req.body.ganadas}\",\"${req.body.perdidas}\",\"${req.body.empatadas}\",\"${req.body.jugadas}\",\"${req.body.biografia}\")`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        const sqlEquipoUsuario = `
        INSERT INTO equipo_usuario (usuario_id, equipo_id)
        VALUES(\"${req.body.capitan}\", \"${result.insertId}\")`;

        connection.query(sqlEquipoUsuario, function (err, resultEquipoUsuario) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
          res.send(resultEquipoUsuario);
        })
      }
    });
  }
});


// Nuevo: endpoint para obtener equipos torneos
app.get("/equipos-torneos", function (req, res) {
  let sql = "SELECT * FROM equipos_torneos";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
    res.send(result);
  });
});

// Nuevo: se valida si el equipo ya esta registrado en un torneo en específico, se valida si alcanzo el limite del torneo, se agrega un nuevo equipo
app.post("/equipos-torneos", function (req, res) {
  if (!req.body) {
    console.log("error");
  } else {
    let sql3 = `SELECT * FROM equipos_torneos WHERE torneo_id = ${req.body.torneo_id}`
    connection.query(sql3, function (err, equiposTorneosResult) {

      let torneoSize
      if (req.body.fase === FASES.dieciseisavos) {
        torneoSize = 32
      }
      if (req.body.fase === FASES.octavos) {
        torneoSize = 16
      }
      if (req.body.fase === FASES.cuartos) {
        torneoSize = 8
      }
      if (req.body.fase === FASES.semifinal) {
        torneoSize = 4
      }
      if (req.body.fase === FASES.final) {
        torneoSize = 2
      }
      if (equiposTorneosResult.some(item => item.equipo_id === req.body.equipo_id)) {
        res.status(400);
        res.send({ message: 'El equipo ya esta agregado' })
      } else if (equiposTorneosResult.length >= torneoSize) {
        res.status(400);
        let sql10 = `UPDATE torneos SET estado="PENDIENTE" WHERE torneo_id = \"${req.body.torneo_id}\"`;
        connection.query(sql10, function (err, resultadoCambio) {
          if (err) {
            res.status(400);
            res.send(err)
          } else {
            res.send({ message: 'Este torneo esta completo, prueba con otros.' })
          }
        })
      } else {
        let sql = `INSERT INTO equipos_torneos (torneo_id, equipo_id) VALUES(\"${req.body.torneo_id}\", \"${req.body.equipo_id}\")`;
        connection.query(sql, function (err, resultTorneo) {
          if (err) {
            res.status(400);
            res.send(err)
          } else {
            if (equiposTorneosResult.length === 1 || equiposTorneosResult.length % 2 !== 0) {
              let sqlPartidos = `SELECT * FROM partidos WHERE torneo_id = ${req.body.torneo_id}`
              connection.query(sqlPartidos, function (err, partidosResult) {
                if (err) {
                  res.status(400);
                  res.send(err)
                }

                let posicion = 1
                if (partidosResult.length) {
                  posicion = partidosResult[partidosResult.length - 1].posicion
                  const countPosicion = partidosResult.filter(item => item.posicion === posicion);
                  if (countPosicion.length === 2) {
                    posicion = posicion + 1
                  }
                }

                const equipoFirst = equiposTorneosResult[equiposTorneosResult.length - 1].equipo_id

                let sql = `INSERT INTO partidos (torneo_id, juego_id, fecha, equipo_first, equipo_second, resultado_first, resultado_second, comentario, posicion, fase)
                          VALUES(${req.body.torneo_id}, 1, NOW(), ${equipoFirst}, ${req.body.equipo_id}, 0, 0, '', ${posicion}, '${req.body.fase}')`;
                connection.query(sql, function (err, equipoResult) {
                  if (err) {
                    res.status(400);
                    res.send(err)
                  } else {
                    res.send({ message: equipoResult });
                  }
                });
              });
            } else {
              res.send({ message: 'Agregado' });
            }
          }
        });
      }
    })
  }
});

app.listen(8000);
