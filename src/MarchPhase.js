import { Resource } from "./CTile";
import { SS } from "./SGameState";

function CanMarch(GameState, player)
{
	for (var tile of GameState.Tiles)
	{
		if (tile.soldiers[player] > 0 && tile.resHere[Resource.Food] > 0)
			return true;
	}
	return false;	
}

export function EnterMarchPhase(GameState, player)
{
	if (!CanMarch(GameState,player))
	{
		GameState.AdvancePhase(player);
	}

	GameState.SelectionState = SS.InitialTile;
	GameState.SelectedTile = null;
}

export function MarchPhaseClicked(GameState, player, tile, resourceClicked)
{
	if (GameState.SelectionState === SS.InitialTile)
	{
		if (GameState.SelectedTile === tile)
		{
			GameState.SelectedTile = null;
			return;
		}
		else
		{			
			GameState.SelectedTile = tile;

			if (GameState.SelectedTile.soldiers[player] <= 0 || GameState.SelectedTile.resHere[Resource.Food] <= 0)
			{
				GameState.SelectedTile = null;
				return;//need both food an non-tired soldiers				
			}
		}
	}
	else if (GameState.SelectionState === SS.ResourcesAndDest)
	{
		if (GameState.SelectedTile === tile || GameState.SelectedTile === null)
		{
			GameState.SelectedTile = null;
			GameState.SelectionState = SS.InitialTile;
		}
		//dest tile
		if (GameState.SelectedTile.CalculateSoldierDistance(tile) > 1)
			return;

		GameState.SelectedTile.soldiers[player] -= 1;
		tile.tiredSoldiers[player] += 1;
		GameState.SelectedTile.resHere[Resource.Food] -= 1;
		
		if (GameState.SelectedTile.soldiers[player] <= 0 || GameState.SelectedTile.resHere[Resource.Food] <= 0)
		{
			GameState.SelectedTile = null;
			GameState.SelectionState = SS.InitialTile;
		}
	}
}