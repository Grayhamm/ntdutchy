import { STile } from "./CTile";
import { Resource } from "./CTile";

export function EnterFeedPhase(GameState, player)
{
	if (!CanFeedMore(player, GameState.Tiles))
		GameState.AdvancePhase(player);
}

function CanFeedMore(player, tiles)
{
	for (var tile of tiles)
	{
		if (tile.unfedWorkers[player] > 0 && tile.resHere[Resource.Food] > 0)	
			return true;	
	}

	return false;
}

export function FeedPhaseClicked(GameState, player, tile, res)
{
	//click tile, feed worker
	if (tile.resHere[Resource.Food] <= 0 || tile.unfedWorkers[player] <= 0)
	{
		//TODO: error sound
		return;
	}	

	tile.resHere[Resource.Food]--;
	tile.unfedWorkers[player] -= 1;
	tile.fedWorkers[player] += 1;

	GameState.Invalidate();
	//TODO: play animation, flash worker thing	

	if (!CanFeedMore(player, GameState.Tiles))
	{
		GameState.AdvancePhase(player);
	}
}