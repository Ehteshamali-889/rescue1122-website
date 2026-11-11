import urllib.request,pathlib
base='https://www.rescue.gov.pk/Images/'
files={'logo.png':'RescueLogo.png','hero.jpg':'CenterImage/New1.jpg','flood.jpg':'CenterImage/Flood2025.jpg','ambulance.jpg':'Ambulance_1.jpg','rescue.jpg':'RescueService.jpg','fire.jpg':'FireService2.jpg','motorbike.png':'MBAS.png','water.png':'WaterRescue.png','animal.png':'AnimalRescue.png','building.jpg':'BuildingSafetyMain.jpg','community.jpg':'CommunityTraining.jpg','academy.jpg':'CenterImage/IRCBannerNew.jpg'}
for name,url in files.items():
 try:
  urllib.request.urlretrieve(base+url,pathlib.Path(__file__).parent/'public'/'images'/name)
  print(name)
 except Exception as e: print(name,str(e))
