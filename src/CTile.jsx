import React from 'react'
import { SS, TP_WORK } from './SGameState';

export const Resource = {
  Food: 0,
  Wood: 1,
  Stone: 2,
  Metal: 3
}


export class STile
{  
  constructor (ty)
  {
    this.terrain = ty;

    this.resYield = [0,0,0,0];    
    this.resHere = [0,0,0,0];
	this.fedWorkers = [0,0];
	this.unfedWorkers =[0,0];
	this.soldiers=[0,0];
	this.tiredSoldiers=[0,0];
	this.improved = false;

	this.OnClick = function (/*-1 if no resource*/){};

	this.highlight = false;
	this.glowResources = false;

	this.x = 0;
	this.y = 0;
  }

  ConsumeWorker(player)
  {
	this.fedWorkers[player] -= 1;
	this.unfedWorkers[player] += 1;
  }

  ConsumeSoldier(player)
  {
	this.soldiers[player] -= 1;
	this.tiredSoldiers[player] += 1;
  }

  ConsumeResources(res)
  {
	for (var i=0; i<4; i++)
	{
		this.resHere[i] -= res[i];
	}
  }

  CalculateWorkerDistance(destTile)
  {
	if (destTile === this)
		return 0;

	var dx = Math.abs(destTile.x - this.x);
	var dy = Math.abs(destTile.y - this.y);

	if (dx > 1 || dy > 1)
		return 2;

	return 1;
  }

  CalculateSoldierDistance(destTile)
  {
	var dx = Math.abs(destTile.x - this.x);
	var dy = Math.abs(destTile.y - this.y);

	return dx + dy;
  }
}

const resColors = ["#00FF00","#A07435","#c3c3da","#BBAA00"];
const resBorderColors = ["#006600","#503212","#73738a","#665500"];

export function MakeImageIcon(txt, img, clickFunc, glow)
{
	var classNames = "statusIcon " + img;

	if (glow)
		classNames += " statusIconGlow";

	return (
		<div className={classNames} onClick={clickFunc!=null?clickFunc:function(){}}>
			{txt}
		</div>		
	)
}

function MakeIcon(txt, fillColor, bordColor, hide)
{
	var classNames = "statusIcon centerThings" + (hide?' hide':'');
  return (
    <div className={classNames} style={{backgroundColor:fillColor, borderColor:bordColor}}>
      {txt}
    </div>
  );
}

export const imgIcons = ["iconFood", "iconWood", "iconStone", "iconMetal"];

function RenderYield(tile)
{
	var icons = [];
	
	for (var i=0; i<4; i++)
	{
		if (tile.resYield[i] <= 0)
			continue;

		if (imgIcons[i] != null)
		{
			icons.push(MakeImageIcon("+"+tile.resYield[i], imgIcons[i]));
		}			
		else
		{
			icons.push(MakeIcon(tile.resYield[i], resColors[i], resBorderColors[i], false));
		}
	}

	if (icons.length <= 0)
	{
		icons.push(MakeIcon(0, 0, 0, true));
	}

	return (
  	<div className="yieldDisplay centerThings">
			{icons}
    </div>
	);
}



function RenderResources(tile, glow)
{
	
	var icons = [];
	
	for (var i=0; i<4; i++)
	{
		if (tile.resHere[i] > 0)
		{
			if (imgIcons[i] != null)
			{
				
				icons.push(MakeImageIcon(tile.resHere[i], imgIcons[i], tile.OnClick.bind(null, i), glow));
			}			
			else
			{
				icons.push(MakeIcon(tile.resHere[i], resColors[i], resBorderColors[i], false));
			}
		}
	}

	return (
  	<div className="resourceDisplay centerThings">
		{icons}
    </div>
	);
}

const WorkerColors = ["#6666FF", "#FF6666"];
const SoldierColors = ["#66FFFF", "#FF00AA"];

const WorkerIcons = ["iconWorker", "iconEnemyWorker"]
const SoliderIcons = ["iconSoldier", "iconEnemySoldier"]

function RenderOnePeople(tile, player)
{
	var icons = [];
	var totalWorkers = tile.fedWorkers[player] + tile.unfedWorkers[player];
	if (totalWorkers > 0)
	{
		icons.push(MakeImageIcon("" + tile.fedWorkers[player] + "/" + totalWorkers, WorkerIcons[player]));
	}
	else
	{
		icons.push(MakeIcon(0, 0, 0, true));
	}

	var totalSoldiers = tile.soldiers[player] + tile.tiredSoldiers[player];
	if (totalSoldiers > 0)
	{
		//icons.push(MakeIcon(tile.soldiers[player], SoldierColors[player], "#000000", false));
		
		var solds = tile.soldiers[player];
		if (solds === totalSoldiers)
			icons.push(MakeImageIcon(tile.soldiers[player], SoliderIcons[player]));
		else
			icons.push(MakeImageIcon(tile.soldiers[player] + "/" + totalSoldiers, SoliderIcons[player]));
	}
	else
	{
		icons.push(MakeIcon(0, 0, 0, true));
	}

	return icons;
}

function RenderPeople(tile)
{
	var icons=[];
	icons = RenderOnePeople(tile, 0);
	icons = [...icons, RenderOnePeople(tile, 1)];
	//icons.push(MakeIcon(0, "#6666FF", "#000000", false));
	return (
	<div className="peopleDisplay centerThings">
		{icons}
	</div>
	);
}

export default function CTile(props) {
  var tile = props.tile;
  var resourceString;
	
	const tileClasses = [
		"tileHidden", 
		"tilePlayerKeep", 
		"tileEnemyKeep", 
		"tileFarm",
		"tileGrassland", 
		"tileWoods", 
		"tilePlains", 
		"tileHills", 
		"tileMountain"];

	var tileClassNames = "tile " + tileClasses[tile.terrain];	 

	var GameState = props.gamestate;

	if (GameState.SelectedTile === tile)
		tileClassNames += " tileSelected";	
	else
		tileClassNames += " tileTargeting";

	if (tile.improved)
		tileClassNames += " tileImproved";

	var glow = false;

	if (tile == GameState.SelectedTile && GameState.SelectionState == SS.ResourcesAndDest && GameState.TurnPhase === TP_WORK)
		glow = true;
  
  return (
    <div className={tileClassNames} onClick={tile.OnClick.bind(null,-1)}>
		<div className="tileDataDisplays">
			{RenderResources(tile, glow)}
			{RenderPeople(tile)}
			{RenderYield(tile)}
		</div>
    </div>
  )
}
