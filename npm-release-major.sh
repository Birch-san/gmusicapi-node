#!/bin/bash
npm version major
npm publish
git push origin master --follow-tags