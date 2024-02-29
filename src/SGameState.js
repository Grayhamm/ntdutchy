import { BuildTerrainMap } from "./CGame";
import { EnterFeedPhase, FeedPhaseClicked } from "./FeedPhase";
import { EnterMarchPhase, MarchPhaseClicked } from "./MarchPhase";
import { WorkPhaseClicked } from "./WorkPhase";

export const TP_FEED = 0;
export const TP_WORK = 1;
export const TP_MARCH = 2;
export const TP_FLEE = 3;

export const SS =
{
	InitialTile: 0,		
	ResourcesAndDest: 1,		
}

export class SGameState
{	
	constructor(fnForceUpdate)
	{
		this.TurnPhase = TP_WORK;
		this.Tiles = BuildTerrainMap();
		this.NeedsRefresh = false;
		this.ForceUpdate = fnForceUpdate;
		//FEED PHase

		//WORK Phase
		this.SelectionState = SS.InitialTile;
		this.SelectedTile = null;
		this.SelectedResources = [];//For moving
		//
	}

	Invalidate()
	{
		this.NeedsRefresh = true;
	}

	HandleClick(tile, resourceClicked)
	{
		if (this.TurnPhase === TP_FEED)
			FeedPhaseClicked(this, 0, tile, resourceClicked);
		else if (this.TurnPhase === TP_WORK)
			WorkPhaseClicked(this, 0, tile, resourceClicked);
		else if (this.TurnPhase === TP_MARCH)
			MarchPhaseClicked(this, 0, tile, resourceClicked);		
		//setTiles([...Tiles]);				
	

		return true;
	}

	AdvanceTurn(player)
	{
		console.log("boop");
		for (var tile of this.Tiles)
		{
			for (var p=0; p<2; p++)
			{
				tile.soldiers[p] += tile.tiredSoldiers[p];
				tile.tiredSoldiers[p] = 0;
			}

			//calculate tile control
			//calculate split resources
		}

		this.ForceUpdate();
	}

	AdvancePhase(player)
	{
		if (player !== 1 && player !== 0)
		{
			console.log("Invalid player in AdvancePhase");
			console.trace();
		}

		if (this.TurnPhase === TP_FEED)
			this.ChangePhase(TP_WORK, player);
		else if (this.TurnPhase == TP_WORK)
			this.ChangePhase(TP_MARCH, player);
		else if (this.TurnPhase == TP_MARCH)
			this.ChangePhase(TP_FLEE, player);
		else if (this.TurnPhase == TP_FLEE)
			{								
				this.ChangePhase(TP_FEED, player);
			}
	}

	ChangePhase(newPhase, player)
	{
		if (newPhase != this.TurnPhase)
		{
			this.ExitPhase(this.TurnPhase, player);			
			this.TurnPhase = newPhase;
			this.EnterPhase(newPhase, player);
		}

		this.ForceUpdate();
	}

	ExitPhase(oldPhase, player)
	{
		
	}

	EnterPhase(newPhase, player)
	{
		if (newPhase === TP_FEED)
		{
			this.AdvanceTurn(player);
			EnterFeedPhase(this, player);
		}
		else if (newPhase === TP_WORK)
		{
			this.SelectionState = SS.InitialTile;
			this.SelectedTile = null;
		}
		else if (newPhase === TP_MARCH)
		{
			EnterMarchPhase(this,player);
		}
		else if (newPhase === TP_FLEE)
		{
			this.AdvancePhase(player);
		}
	}

}