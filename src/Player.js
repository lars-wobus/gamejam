import soundCollectCoin from '../assets/audio/Cha_Ching_Register-Muska666-173262285.mp3'
import soundDie from '../assets/audio/Cha_Ching_Register-Muska666-173262285.mp3'
import soundGetHurt from '../assets/audio/Cha_Ching_Register-Muska666-173262285.mp3'
import spritesheet from '../assets/player.png'
import Entity from './Entity'
import Path from './Path'
import Wall from './Wall'

export default class Player extends Entity {

  static preload() {
    $game.load.audio('collectCoin', soundCollectCoin)
    $game.load.audio('die', soundDie)//TODO not in use
    $game.load.audio('getHurt', soundGetHurt)
    $game.load.spritesheet('player', spritesheet, $constants.TILE_SIZE, $constants.TILE_SIZE)
  }

  constructor() {
    super()
    this.lives = $constants.PLAYER_LIVES
    this.speed = $constants.PLAYER_SPEED
    this.coins = 10
    this.bombs = 0
    this.accelerate = 0
    this.invise = 0
    this.super = 0
    $gui.setLives(this.lives)
    $gui.setCoins(this.coins)
  }

  create() {
    this.startTime = $game.time.now
    this.soundCollectCoin = $game.add.audio('collectCoin');
    this.soundDie = $game.add.audio('die');
    this.soundGetHurt = $game.add.audio('getHurt');
    this.sprite = $game.add.sprite(this.x, this.y, 'player')
    this.sprite.data = this
    this.sprite.animations.add('walk', null, 8, true)
    this.sprite.animations.play('walk')
    $game.physics.arcade.enable(this.sprite)
  }

  update() {
    $game.physics.arcade.collide(this.sprite, Wall.layer)
    $game.physics.arcade.overlap(this.sprite, Path.layer, this.collide)
    const cursors = $game.input.keyboard.createCursorKeys()
    if (this.accelerate > 0) {
      this.accelerate -= ($game.time.now - this.startTime)%2
      this.speed = $constants.PLAYER_SPEED*1.5
    } else {
      this.accelerate = 0
      this.speed = $constants.PLAYER_SPEED
    }

    if(this.invise > 0) this.invise -= ($game.time.now - this.startTime)%2
    if(this.super > 0) this.super -= ($game.time.now - this.startTime)%2

    this.sprite.alpha = (this.invise > 0) ? .5 : 1
    this.sprite.body.velocity = {
      x: this.speed * (cursors.right.isDown - cursors.left.isDown),
      y: this.speed * (cursors.down.isDown - cursors.up.isDown),
    }

    this.startTime = $game.time.now
  }

  loseLife() {
    --this.lives
    $gui.setLives(this.lives)
    this.soundGetHurt.play();
  }

  gainLife() {
    ++this.lives
    $gui.setLives(this.lives)
  }

  collectCoins(number) {
    this.coins += number
    $gui.setCoins(this.coins)
    this.soundCollectCoin.play();
  }

  spendCoins(number) {
    this.coins -= number
    $gui.setCoins(this.coins)
  }

  speedItem() {
    this.accelerate = $constants.BOOST_DURATION*2
  }

  bombItem() {
    this.bombs++
  }

  inviseItem() {
    this.invise = $constants.BOOST_DURATION*2
  }

  superItem() {
    this.super = $constants.BOOST_DURATION
  }
}
