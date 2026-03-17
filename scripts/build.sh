#!/bin/bash

# 檢查是否提供了專案名稱
if [ -z "$1" ]; then
  echo "Usage: ./build.sh <project-name>"
  echo "Example: ./build.sh project-a"
  exit 1
fi

# 根據參數來構建特定的專案
case $1 in
  a)
    echo "Building Project A..."
    docker build -t cmd_note ./cmd_note
    ;;
  b)
    echo "Building Project B..."
    docker build -t cmd_unit_converter ./cmd_unit_converter
    ;;
  *)
    echo "Unknown project: $1"
    exit 1
    ;;
esac

echo "$1 build completed!"