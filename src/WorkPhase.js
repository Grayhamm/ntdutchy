import { TileHasResources } from "./CActionBar";
import { Resource } from "./CTile";
import { SGameState } from "./SGameState";
import { SS } from "./SGameState";

function UnloadSelectedResourcesToTile(GameState, tile)
{
	console.log("Sel REs:" + GameState.SelectedResources)
	for (var res of GameState.SelectedResources)
	{
		tile.resHere[res] += 1;
	}
	GameState.SelectedResources = [];
}

function ResetTileSelection(GameState)
{
	GameState.SelectedTile = null;			
	GameState.SelectionState = SS.InitialTile;			
}

function CanWorkMore(GameState, player)
{
	const keepTerrain = [1,2];
	for (var tile of GameState.Tiles)
	{
		if (tile.fedWorkers[player] > 0)
			return true;

		if (tile.terrain === keepTerrain[player])
		{
			if (TileHasResources(tile, [0,1,1,0]) || TileHasResources(tile, [0,1,0,2]))
			{
				return true;
			}
		}
	}

	return false;
}

export function WorkPhaseClicked(GameState, player, tile, resourceClicked)
{
	//Select a tile
	if (GameState.SelectionState === SS.InitialTile)
	{
		if (GameState.SelectedTile === tile)
		{
			GameState.SelectedTile = null;
			GameState.Invalidate();
		}
		else
		{				
			GameState.SelectedTile = tile;			
			GameState.Invalidate();
		}
	}
	else if (GameState.SelectionState === SS.ResourcesAndDest)
	{
		if (resourceClicked == -1)
		{
			if (tile === GameState.SelectedTile)
			{
				//Cancel				
				if (GameState.SelectedTile != null)
				{
					//put resources back
					UnloadSelectedResourcesToTile(GameState, GameState.SelectedTile);
					
				}	
				ResetTileSelection(GameState);			
			}
			else
			{

				if (GameState.SelectedTile.CalculateWorkerDistance(tile) > 1)
					return;//too far away

				//move resources and worker to new tile, worker is now unfed
				GameState.SelectedTile.fedWorkers[player] -= 1;
				tile.unfedWorkers[player] += 1;				

				UnloadSelectedResourcesToTile(GameState, tile);
				ResetTileSelection(GameState);
			}
		}
		else
		{
			if (GameState.SelectedResources.length < 3)
			{
				GameState.SelectedResources.push(resourceClicked);
				tile.resHere[resourceClicked] -= 1;
			}
		}
	}

	if (!CanWorkMore(GameState,player))
		GameState.AdvancePhase(player);

	GameState.ForceUpdate();	
}

export function WorkPhaseWork(GameState, player)
{	
	if (GameState.SelectedTile == null)
	{
		//TODO: Error SFX
		return;
	}

	if (GameState.SelectedTile.fedWorkers[player] <= 0)
	{
		//TODO: Error SFX
		return;
	}

	GameState.SelectedTile.ConsumeWorker(player);

	for (var i=0; i<4; i++)
	{
		GameState.SelectedTile.resHere[i] += GameState.SelectedTile.resYield[i];		
	}

	if (!CanWorkMore(GameState,player))
		GameState.AdvancePhase(player);	
	GameState.ForceUpdate();
}

export function WorkPhaseMove(GameState, player)
{
	if (GameState.SelectedTile == null)
	{
		//TODO: Error SFX
		return;
	}

	GameState.SelectionState = SS.ResourcesAndDest;	
	GameState.ForceUpdate();
}

export function WorkPhaseImprove(GameState, player)
{
	if (GameState.SelectedTile == null)
	{
		//TODO: Error SFX
		return;
	}

	if (GameState.SelectedTile.improved)
	{
		return;
	}

	if (!TileHasResources(GameState.SelectedTile, [0,0,2,0]))
		return;

	GameState.SelectedTile.improved = true;
	GameState.SelectedTile.resHere[Resource.Stone] -= 2;
	GameState.SelectedTile.ConsumeWorker(player);
	var highestYield = 0;
	var highestRes = 0;

	for (var i=0; i<4; i++)
	{
		if (GameState.SelectedTile.resYield[i] >= highestRes)
		{
			highestYield = GameState.SelectedTile.resYield[i];
			highestRes = i;
		}
	}

	GameState.SelectedTile.resYield[highestRes] += 1;

	if (!CanWorkMore(GameState,player))
		GameState.AdvancePhase(player);
	GameState.ForceUpdate();
}

export function WorkPhaseBuildWorker(GameState, player)
{
	var workerCost = [0,1,1,0];

	if (GameState.SelectedTile === null)
		return;

	if (!TileHasResources(GameState.SelectedTile, workerCost))
		return;

	GameState.SelectedTile.ConsumeResources(workerCost);
	GameState.SelectedTile.unfedWorkers[player] += 1;

	if (!CanWorkMore(GameState,player))
		GameState.AdvancePhase(player);
	GameState.ForceUpdate();
}

export function WorkPhaseBuildSoldier(GameState, player)
{
	var soldierCost = [0,1,0,2];

	if (GameState.SelectedTile === null)
		return;

	if (!TileHasResources(GameState.SelectedTile, soldierCost))
		return;

	GameState.SelectedTile.ConsumeResources(soldierCost);
	GameState.SelectedTile.soldiers[player] += 1;

	if (!CanWorkMore(GameState,player))
		GameState.AdvancePhase(player);
	GameState.ForceUpdate();
}