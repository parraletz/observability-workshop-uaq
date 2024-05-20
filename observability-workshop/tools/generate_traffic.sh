#!/bin/bash

watch 'curl -s http://localhost:3000/api/item/1; curl -s http://localhost:3000/api/item/2; curl -s http://localhost:3000/api/item/3; curl -s http://localhost:3000/api/item/getAll'
