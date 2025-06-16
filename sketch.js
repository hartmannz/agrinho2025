// Variáveis principais
let cachorro;
let item;
let troncos = [];
let pontuacao = 0;
let tempoLimite = 30;
let tempoRestante;
let cenaAtual = "cidade"; // "cidade" ou "campo"
let nivel = 1;
let cronometro;

function setup() {
  createCanvas(600, 400);
  
  // Inicia o personagem (cachorro) e o item
  cachorro = new Cachorro();
  item = new Item(100, height / 2); // Posição inicial na cidade
  tempoRestante = tempoLimite; // Tempo para cada entrega
  cronometro = millis(); // Inicia o cronômetro
}

function draw() {
  background(220);
  
  // Exibe o cenário dependendo de onde o personagem está
  if (cenaAtual === "cidade") {
    exibirCidade();
  } else {
    exibirCampo();
  }
  
  // Exibe o cachorro e o item
  cachorro.display();
  item.display();
  
  // Movimenta o cachorro
  cachorro.move();
  
  // Verifica se o cachorro pegou o item
  if (dist(cachorro.x, cachorro.y, item.x, item.y) < 20 && item.pickedUp === false) {
    item.pickedUp = true; // O item foi pego
    tempoRestante = tempoLimite; // Reseta o cronômetro
    cronometro = millis(); // Reseta o cronômetro
  }
  
  // Cronômetro
  let tempoPassado = (millis() - cronometro) / 1000;
  tempoRestante = tempoLimite - tempoPassado;
  
  // Se o tempo terminar e o item não foi entregue, perde pontos
  if (tempoRestante <= 0) {
    tempoRestante = 0;
    if (item.pickedUp) {
      item.pickedUp = false; // O item volta para a posição inicial
      cenaAtual = cenaAtual === "cidade" ? "campo" : "cidade"; // Troca de lado
    }
  }

  // Adiciona troncos aleatórios no caminho
  if (frameCount % 60 === 0 && cenaAtual === "cidade") {
    troncos.push(new Tronco());
  }
  if (frameCount % 60 === 0 && cenaAtual === "campo") {
    troncos.push(new Tronco());
  }
  
  // Atualiza e exibe os troncos
  for (let i = troncos.length - 1; i >= 0; i--) {
    troncos[i].display();
    troncos[i].move();
    if (troncos[i].x < 0) {
      troncos.splice(i, 1); // Remove troncos que saíram da tela
    }
    
    // Verifica colisão com os troncos
    if (dist(cachorro.x, cachorro.y, troncos[i].x, troncos[i].y) < 30) {
      // Perde pontos ao colidir com um tronco
      pontuacao -= 5;
      troncos.splice(i, 1); // Remove o tronco após a colisão
      reiniciarJogo(); // Reinicia o jogo se colidir com um tronco
    }
  }

  // Verifica se o cachorro entregou o item
  if (cenaAtual === "cidade" && cachorro.x > width - 50 && item.pickedUp) {
    pontuacao += Math.floor(tempoRestante * 10); // Pontos baseados no tempo restante
    item.pickedUp = false; // O item volta para a posição inicial
    item.x = 100;
    cenaAtual = "campo"; // Muda para o campo
    nivel++;
    tempoLimite -= 1; // Reduz o tempo limite para cada nível
  }
  if (cenaAtual === "campo" && cachorro.x < 50 && item.pickedUp) {
    pontuacao += Math.floor(tempoRestante * 10); // Pontos baseados no tempo restante
    item.pickedUp = false;
    item.x = width - 100;
    cenaAtual = "cidade"; // Muda para a cidade
    nivel++;
    tempoLimite -= 1; // Reduz o tempo limite para cada nível
  }

  // Exibe a pontuação e o tempo restante
  textSize(16);
  fill(0);
  text("Pontuação: " + pontuacao, 10, 20);
  text("Tempo: " + Math.ceil(tempoRestante), 500, 20);
  text("Nível: " + nivel, 10, 40);
}

class Cachorro {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.velocidade = 3;
  }

  display() {
    fill(255, 255, 0); // Cor do cachorro
    ellipse(this.x, this.y, 30, 30); // Representa o cachorro
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.velocidade;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.velocidade;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.velocidade;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.velocidade;
    }
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.pickedUp = false;
  }

  display() {
    if (!this.pickedUp) {
      fill(255, 0, 0); // Item representado por um círculo vermelho
      ellipse(this.x, this.y, 20, 20);
    }
  }
}

class Tronco {
  constructor() {
    this.x = random(width / 2, width - 50);
    this.y = random(height / 4, height - 40);
    this.velocidade = 3;
  }

  display() {
    fill(139, 69, 19); // Cor do tronco
    rect(this.x, this.y, 50, 15); // Tronco como retângulo
  }

  move() {
    this.x -= this.velocidade; // Movimento dos troncos da direita para a esquerda
  }
}

function exibirCidade() {
  // Cenário da cidade: fundo azul e alguns prédios simples
  fill(200, 200, 255);
  rect(0, 0, width / 2, height);  // Corpo da cidade (lado esquerdo)
  
  // Detalhes: prédios simples
  fill(100, 100, 255);
  rect(50, height - 100, 50, 100);  // Prédio 1
  rect(150, height - 120, 50, 120); // Prédio 2
}

function exibirCampo() {
  // Cenário do campo: fundo verde e uma árvore simples
  fill(0, 255, 0);
  rect(width / 2, 0, width / 2, height);  // Corpo do campo (lado direito)
  
  // Árvore simples
  fill(34, 139, 34);
  ellipse(width - 100, height / 2, 60, 60); // Copa da árvore
  fill(139, 69, 19);
  rect(width - 110, height / 2 + 20, 20, 40); // Tronco da árvore
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  // Reseta as variáveis
  cachorro.x = 50;
  cachorro.y = height / 2;
  pontuacao = 0;
  nivel = 1;
  tempoRestante = tempoLimite;
  cronometro = millis();
  item.x = 100;
  item.pickedUp = false;
  troncos = []; // Remove todos os troncos
  cenaAtual = "cidade"; // Inicia o jogo de novo na cidadeda árvore
}