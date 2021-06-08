'use strict';

var _TargetRepoSlug;
var _PAT;
var _TargetOwner;
var _TargetRepo;
var _Ref;


const core = require('@actions/core');

const github = require('@actions/github');

const fs = require('fs');

require('dotenv').config();

//path of local env file, when testing and developing
const path = './.env';


if (fs.existsSync(path)) {
  console.log(
    '\x1b[31m%s\x1b[0m',
    `|-----------------------------------------------------------------------------------------|`
  );
  console.log(
    '\x1b[31m%s\x1b[0m',
    `|-----------------------------------> .env FILE FOUND.<-----------------------------------|`
  );
  console.log(
    '\x1b[31m%s\x1b[0m',
    `|-------------------------> YOU BETTER BE RUNNING THIS LOCALLY :^) <----------------------|`
  );
  console.log(
    '\x1b[31m%s\x1b[0m',
    `|-----------------------------------------------------------------------------------------|`,
    `\n`
  );

  //----> Values for local testing with .env file <----//
  var _PAT = process.env.PAT;
  var _TargetRepoSlug = process.env.TargetRepoSlug;
  var _Ref = process.env.Ref;
  //----> Values for local testing with .env file <----//
} else {
  console.log(
    '\x1b[32m%s\x1b[0m',
    `|--------------------------------------------------------------------|`
  );
  console.log(
    '\x1b[32m%s\x1b[0m',
    `|--------------------> GitHub Action Initiated <---------------------|`
  );
  console.log(
    '\x1b[32m%s\x1b[0m',
    `|--------------------------------------------------------------------|`,
    `\n`
  );
  console.log(' ');

  //----> Values that the GitHub Action will receive <----//
  var _PAT = core.getInput('GITHUB_TOKEN');
  var _TargetRepoSlug = core.getInput('TargetRepoSlug');
  var _Ref = core.getInput('Ref');
  //----> Values that the GitHub Action will receive <----//
  console.log(
    '\x1b[32m%s\x1b[0m',
    `|------------------------> Action Input Values <---------------------|`
  );
  console.log('\x1b[32m%s\x1b[0m', `   PAT: ${_PAT}`);
  console.log('\x1b[32m%s\x1b[0m', `   TargetRepoSlug: ${_TargetRepoSlug}`);
  console.log('\x1b[32m%s\x1b[0m', `   Ref: ${_Ref}`);
}



//await _getDeployments()
const ghClient = github.getOctokit(_PAT);

init(_TargetRepoSlug, _PAT, _Ref);

async function init(TargetRepoSlug, PAT, Ref) {
  _TargetRepoSlug = TargetRepoSlug;
  _PAT = PAT;
  _TargetOwner = _TargetRepoSlug.split('/')[0];
  _TargetRepo = _TargetRepoSlug.split('/')[1];
  _Ref = Ref;

  var deploymentEnvironments = await _getDeployments();

  console.log('\x1b[36m%s\x1b[0m', `      Deployment Environments: ${deploymentEnvironments}`);

  core.setOutput("environmentNameList", deploymentEnvironments)

}

async function _getDeployments() {
  //console.log('\x1b[36m%s\x1b[0m', `|-----------------TOTAL # OF ISSUES TO CREATE: ${issues.length}-----------------|`)
  console.log(`\n`);
    
    var issue

    try {
      issue = await ghClient.repos.listDeployments({
        owner: _TargetOwner,
        repo: _TargetRepo,
        ref: _Ref
      });
    } catch (error) {
      console.log(
        '\x1b[31m%s\x1b[0m',
        `|<---------------------------> ERROR CREATING ISSUE <---------------------------------->|`
      );
      console.log('\x1b[31m%s\x1b[0m', `   |---> ERROR: ${error}`);

    }

    console.log('\x1b[36m%s\x1b[0m', `   Get Deployment Successful for ref: ${_Ref}`);
    console.log('\x1b[36m%s\x1b[0m', `      Environments: ${issue.data.length}`);
    // console.log('\x1b[36m%s\x1b[0m', `      Title: ${issue.data}`);
    // console.log('\x1b[36m%s\x1b[0m', `      Body: ${issue.data}`);

    let environments = issue.data.map(a => a.environment);

    return environments
}


