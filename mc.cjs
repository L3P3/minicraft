#!/usr/bin/env bake
<?
vars.base_env_app=vars.base_env_app_HTML_GENERIC;
vars.base_env_app_version=5;

vars.app_mode_client=true;

include('src');
?>