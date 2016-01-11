#!/bin/bash
npm version patch
npm publish
git push origin master --follow-tags