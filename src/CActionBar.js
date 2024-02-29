import React from 'react'

import { WorkPhaseBuildSoldier, WorkPhaseBuildWorker, WorkPhaseImprove, WorkPhaseWork } from './WorkPhase';
import { WorkPhaseMove } from './WorkPhase';
import { MakeImageIcon, Resource, imgIcons } from './CTile';


function CPhaseBar(props) {
	var Phase = props.Phase;
	var GameState = props.gamestate;	
	var player = 0;
  return (
	<div><h1>{Phase}</h1><button onClick={() => GameState.AdvancePhase(player)}>Next Phase</button></div>
  )
}

function DrawResourceCost(GameState, resCost)
{
	var icons = [];	
	
	for (var i=0; i<4; i++)
	{		
		if (resCost[i] > 0)
		{
			icons.push(MakeImageIcon(resCost[i], imgIcons[i], /*TODO send back?*/null));
		}			
	}

	return (
		<div className="resourceDisplay centerThings" style={{top:"-20px", color:"black"}}>
			{icons}
		</div>
	);
}

function DrawCarriedResources(GameState)
{	
	var icons = [];

	if (GameState.SelectedResources.length <= 0)
		return <></>;
	
	for (var res of GameState.SelectedResources)
	{		
		if (imgIcons[res] != null)
		{
			icons.push(MakeImageIcon(" ", imgIcons[res], /*TODO send back?*/null));
		}			
	}

	return (
		<div className="resourceDisplay centerThings" style={{top:"-20px"}}>
			{icons}
		</div>
	);
	
}

function DrawMoveButton(GameState, player)
{
	var WorkStateMove = function () { WorkPhaseMove(GameState, 0); };

	var moveClasses = "actionButton btnMove";
	if (GameState.SelectedTile == null || GameState.SelectedTile.fedWorkers[player] <= 0)
		moveClasses += " actionButtonDisabled";
	return ((
		<div className={moveClasses} onClick={WorkStateMove}>
				<h1>Move</h1>
				{DrawCarriedResources(GameState)}
		</div>
	));
}

function DrawWorkButton(GameState, player)
{
	var WorkStateWork = function () { WorkPhaseWork(GameState, 0); };
	var workClasses = "actionButton btnWork";	
	var hasYield = false;
	if (GameState.SelectedTile != null)
	{
		for (var res of GameState.SelectedTile.resYield)
		{
			if (res > 0)
			{
				hasYield = true;
				break;
			}
		}
	}	

	var hasWorkers = false;
	if (GameState.SelectedTile != null)
	{
		hasWorkers = (GameState.SelectedTile.fedWorkers[player] > 0);		
	}

	

	if (GameState.SelectedTile === null || !hasWorkers || !hasYield)
		workClasses += " actionButtonDisabled";

	return ((
		<div className={workClasses} onClick={WorkStateWork}>
			<h1>Work</h1>
		</div>
	));
}

function DrawImproveButton(GameState, player)
{
	var WorkStateImprove = function () { WorkPhaseImprove(GameState, player); };
	var improveClasses = "actionButton btnImprove";
	var hasStone = false;
	var improveCost = [0,0,2,0];
	if (GameState.SelectedTile != null)
	{
		hasStone = TileHasResources(GameState.SelectedTile, improveCost);
	}	

	if (GameState.SelectedTile === null || GameState.SelectedTile.fedWorkers[player] <= 0 || !hasStone || GameState.SelectedTile.improved)
		improveClasses += " actionButtonDisabled";
	return ((
		<div className={improveClasses} onClick={WorkStateImprove}>
			<h2>Improve</h2>
			{DrawResourceCost(GameState, improveCost)}
		</div>
	));
}

export function TileHasResources(tile, cost)
{
	for (var i=0; i<4; i++)
	{
		if (tile.resHere[i] < cost[i])
			return false;
	}

	return true;
}

function DrawBuildWorkerButton(GameState, player)
{
	var workerCost = [0, 1, 1, 0];
	var bwClasses = "actionButton btnBuildWorker";

	var hasResources = false;
	var isKeep = false;

	var keepTerrain = [1, 2];
	
	if (GameState.SelectedTile != null)
	{
		isKeep = (GameState.SelectedTile.terrain === keepTerrain[player]);
		hasResources = TileHasResources(GameState.SelectedTile, workerCost);
	}	

	if (!isKeep || !hasResources)
		bwClasses += " actionButtonDisabled";

	return ((
		<div className={bwClasses} onClick={()=>WorkPhaseBuildWorker(GameState, player)}>
			<h2>Build Worker</h2>
			{DrawResourceCost(GameState, workerCost)}
		</div>			
	));
}


function DrawBuildSoldierButton(GameState, player)
{
	var soldierCost = [0, 1, 0, 2];
	var bwClasses = "actionButton btnBuildSoldier";

	var hasResources = false;
	var isKeep = false;

	var keepTerrain = [1, 2];
	
	if (GameState.SelectedTile != null)
	{
		isKeep = (GameState.SelectedTile.terrain === keepTerrain[player]);
		hasResources = TileHasResources(GameState.SelectedTile, soldierCost);
	}	

	if (!isKeep || !hasResources)
		bwClasses += " actionButtonDisabled";

	return ((
		<div className={bwClasses} onClick={()=>WorkPhaseBuildSoldier(GameState, player)}>
			<h2>Build Soldier</h2>
			{DrawResourceCost(GameState, soldierCost)}
		</div>			
	));
}

function DrawCommandButtons(GameState, player)
{

	var row1Buttons = [];

	row1Buttons.push(DrawMoveButton(GameState, player));
	row1Buttons.push(DrawWorkButton(GameState, player));
	row1Buttons.push(DrawImproveButton(GameState, player));
	

	var row2Buttons = [];

	row2Buttons.push(DrawBuildWorkerButton(GameState, player));

	row2Buttons.push(DrawBuildSoldierButton(GameState,player));


	return ( (
		<>
		<div className="buttonBar">
			{row1Buttons}		
		</div>
		<div className="buttonBar">
			{row2Buttons}
		</div>
		</>
	));


}

export default function CActionBar(props) {
	var GameState = props.gamestate;
	var phasePhrase = ["Feed Workers", "Workers Work", "Soldiers March", "Workers Flee"];
	var phase = phasePhrase[GameState.TurnPhase];
	var commands = [];
	var player = 0;


	
  return (
	<div>
		<CPhaseBar Phase={phase} gamestate={GameState}/>
		{DrawCommandButtons(GameState, player)}		
	</div>
  )
}
