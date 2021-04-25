#!/bin/sh
cd assets
mkdir -p ./vendor/bundle
bundle config set path ./vendor/bundle
bundle install