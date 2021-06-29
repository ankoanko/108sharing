<img src="public/images/custom/logo-black.svg" width="200" alt="Volition">

# 108Sharing

## Requirements
* Ruby 2.7.2
* Rails 6.0.3.6
* Redis 5.0.1 +
* Postgresql 12 +

## Install in development

### Mac OS X

Use Homebrew
```sh
$ brew install redis
$ brew install postgresql
$ brew install imagemagick@6
```

### Ubuntu
```sh
$ apt-get install redis
$ apt-get install postgresql
$ apt-get install imagemagic
```

## Local setup without Docker
```sh
$ git clone git@github.com:bulbinc/108sharing.git
$ cd 108sharing
$ make setup
```

if errors occur, instead of 'make setup' do step by step : 
```
$ bundle install
$ yarn
$ bin/rails db:drop db:create db:migrate db:seed
```
(You may need to do 'yarn upgrade' and on mac you need to install x-code CLI)

when setup is done you can run 
```
$ make dev
```
and see the website on your browser at 'http://localhost:3000'


## Local setup with Docker
```sh
$ git clone git@github.com:bulbinc/108sharing.git
$ cd 108sharing
$ make docker-build
$ make docker-setup
$ make up
```

### 環境変数 - Setup Environment variables
```
$ cp .env.sample .env
```.env```ファイルに環境変数の値を入力する。Update the values in the file.
```

## Demo login users

### admin role

```
admin@example.com / shareusers
```

### user role

```
user@example.com / shareusers
guest@example.com / shareusers
```


## Setup Migration

```sh
$ make migrate
```

## Test
```sh
$ rails rspec
```

## Demo Sites
* [108sharing](https://demo.108sharing.com/)

## Makefile

Read the Makefile to see all possible commands and deployments options!

https://github.com/bulbinc/108sharing/blob/master/Makefile

## WIKI

Refer to the WIKI for more information:

https://github.com/bulbinc/108sharing/wiki

## LICENSE

https://github.com/bulbinc/108sharing/blob/master/LICENSE.txt

[108Sharingのライセンスについて]

108Sharingはのライセンスはデュアルライセンス方式です。無償で利用できる「スタートアップライセンス」と、
有償の「商用ライセンス」が選択できます。
サービスの商用利用を開始した際には商用ライセンスの申し込みが必要になります。
ライセンスに関して詳しくは公式サイトをご確認下さい。

https://108sharing.com/price.html


