(function () {
  function normalizeItemName(value) {
    return String(value || '')
      .replace(/^\s*\d+\s*x\s*/i, '')
      .trim()
      .replaceAll('Ё', 'Е')
      .replaceAll('ё', 'е')
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  const DATA = {"catalog":{"yablonskis hammer":{"name":"Yablonskis Hammer","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":251,"matt":121},"icon":"./assets/ui/items/legacy/shmot/Yablonskis%20Hammer.png"},"the staff":{"name":"The Staff","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":245,"matt":162},"icon":"./assets/ui/items/legacy/shmot/The%20Staff.png"},"dragon hunter axe":{"name":"Dragon Hunter Axe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":342,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Dragon%20Hunter%20Axe.png"},"arcana mace":{"name":"Arcana Mace","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":225,"matt":175},"icon":"./assets/ui/items/legacy/shmot/Arcana%20Mace.png"},"elysian":{"name":"Elysian","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":232,"matt":114},"icon":"./assets/ui/items/legacy/shmot/Elysian.png"},"dasparions staff":{"name":"Dasparions Staff","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":207,"matt":143},"icon":"./assets/ui/items/legacy/shmot/Dasparions%20Staff.png"},"meteor shower":{"name":"Meteor Shower","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":213,"matt":107},"icon":"./assets/ui/items/legacy/shmot/Meteor%20Shower.png"},"doom crusher":{"name":"Doom Crusher","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":282,"matt":114},"icon":"./assets/ui/items/legacy/shmot/Doom%20Crusher.png"},"tuning fork":{"name":"Tuning Fork","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":33000500,"level":62,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":305,"matt":165},"icon":"./assets/ui/items/legacy/shmot/Tuning%20Fork.png"},"heavy war axe":{"name":"Heavy War Axe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":175,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Heavy%20War%20Axe.png"},"sprites staff":{"name":"Sprites Staff","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":170,"matt":122},"icon":"./assets/ui/items/legacy/shmot/Sprites%20Staff.png"},"deadmans glory":{"name":"Deadmans Glory","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":194,"matt":99},"icon":"./assets/ui/items/legacy/shmot/Deadmans%20Glory.png"},"staff of evil spirits":{"name":"Staff of Evil Spirits","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":189,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Staff%20of%20Evil%20Spirits.png"},"big hammer":{"name":"Big Hammer","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"ydar","soul":2,"spirit":2,"stats":{"patt":107,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Big%20Hammer.png"},"battle axe":{"name":"Battle Axe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"ydar","soul":2,"spirit":2,"stats":{"patt":107,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Battle%20Axe.png"},"silver axe":{"name":"Silver Axe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"ydar","soul":2,"spirit":2,"stats":{"patt":107,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Silver%20Axe.png"},"war axe":{"name":"War Axe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":4300000,"level":40,"weaponKind":"ydar","soul":2,"spirit":2,"stats":{"patt":139,"matt":76},"icon":"./assets/ui/items/legacy/shmot/War%20Axe.png"},"morning star":{"name":"Morning Star","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1400000,"level":20,"weaponKind":"ydar","soul":3,"spirit":3,"stats":{"patt":79,"matt":47},"icon":"./assets/ui/items/legacy/shmot/Morning%20Star.png"},"goat head staff":{"name":"Goat Head Staff","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1400000,"level":20,"weaponKind":"ydar","soul":3,"spirit":3,"stats":{"patt":77,"matt":63},"icon":"./assets/ui/items/legacy/shmot/Goat%20Head%20Staff.png"},"spiked club":{"name":"Spiked Club","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":967000,"level":20,"weaponKind":"ydar","soul":2,"spirit":2,"stats":{"patt":64,"matt":39},"icon":"./assets/ui/items/legacy/shmot/Spiked%20Club.png"},"club":{"name":"Club","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":768,"level":0,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":8,"matt":6},"icon":"./assets/ui/items/legacy/shmot/Club.png"},"mace":{"name":"Mace","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":12500,"level":0,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":11,"matt":9},"icon":"./assets/ui/items/legacy/shmot/Mace.png"},"mage staff":{"name":"Mage Staff","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":244000,"level":0,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":30,"matt":28},"icon":"./assets/ui/items/legacy/shmot/Mage%20Staff.png"},"ubiquitous axe":{"name":"Ubiquitous Axe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":244000,"level":0,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":50,"matt":15},"icon":"./assets/ui/items/legacy/shmot/Ubiquitous%20Axe.png"},"basalt battlehammer":{"name":"Basalt Battlehammer","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":102344111,"level":91,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":381,"matt":232},"icon":"./assets/ui/items/legacy/shmot/Basalt%20Battlehammer.png"},"imperial staff":{"name":"Imperial Staff","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":102344111,"level":91,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":374,"matt":275},"icon":"./assets/ui/items/legacy/shmot/Imperial%20Staff.png"},"short bow":{"name":"Short Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":768,"level":0,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":16,"matt":6},"icon":"./assets/ui/items/legacy/shmot/Short%20Bow.png"},"arcana mace r":{"name":"Arcana Mace R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":102344111,"level":91,"weaponKind":"ydar","soul":1,"spirit":1,"stats":{"patt":320,"matt":320},"icon":"./assets/ui/items/legacy/shmot/Arcana%20Mace%20R.png"},"bow":{"name":"Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":12500,"level":0,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":23,"matt":9},"icon":"./assets/ui/items/legacy/shmot/Bow.png"},"composition bow":{"name":"Composition Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":244000,"level":0,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":64,"matt":21},"icon":"./assets/ui/items/legacy/shmot/Composition%20Bow.png"},"strengthened bow":{"name":"Strengthened Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"luk","soul":6,"spirit":6,"stats":{"patt":82,"matt":26},"icon":"./assets/ui/items/legacy/shmot/Strengthened%20Bow.png"},"long bow":{"name":"Long Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":644000,"level":20,"weaponKind":"luk","soul":6,"spirit":6,"stats":{"patt":114,"matt":35},"icon":"./assets/ui/items/legacy/shmot/Long%20Bow.png"},"elven bow":{"name":"Elven Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":825000,"level":20,"weaponKind":"luk","soul":6,"spirit":6,"stats":{"patt":125,"matt":32},"icon":"./assets/ui/items/legacy/shmot/Elven%20Bow.png"},"gastraphetes":{"name":"Gastraphetes","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":967000,"level":20,"weaponKind":"luk","soul":6,"spirit":6,"stats":{"patt":132,"matt":39},"icon":"./assets/ui/items/legacy/shmot/Gastraphetes.png"},"light crossbow":{"name":"Light Crossbow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1800000,"level":20,"weaponKind":"luk","soul":6,"spirit":6,"stats":{"patt":191,"matt":54},"icon":"./assets/ui/items/legacy/shmot/Light%20Crossbow.png"},"crystallized ice bow":{"name":"Crystallized Ice Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"luk","soul":8,"spirit":8,"stats":{"patt":220,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Crystallized%20Ice%20Bow.png"},"elemental bow":{"name":"Elemental Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2870000,"level":40,"weaponKind":"luk","soul":8,"spirit":8,"stats":{"patt":277,"matt":75},"icon":"./assets/ui/items/legacy/shmot/Elemental%20Bow.png"},"noble elven bow":{"name":"Noble Elven Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2870000,"level":40,"weaponKind":"luk","soul":8,"spirit":8,"stats":{"patt":270,"matt":80},"icon":"./assets/ui/items/legacy/shmot/Noble%20Elven%20Bow.png"},"eminence bow":{"name":"Eminence Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":6130000,"level":40,"weaponKind":"luk","soul":8,"spirit":8,"stats":{"patt":323,"matt":83},"icon":"./assets/ui/items/legacy/shmot/Eminence%20Bow.png"},"dark elven long bow":{"name":"Dark Elven Long Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"luk","soul":3,"spirit":3,"stats":{"patt":397,"matt":100},"icon":"./assets/ui/items/legacy/shmot/Dark%20Elven%20Long%20Bow.png"},"bow of peril":{"name":"Bow of Peril","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"luk","soul":3,"spirit":3,"stats":{"patt":401,"matt":99},"icon":"./assets/ui/items/legacy/shmot/Bow%20of%20Peril.png"},"carnage bow":{"name":"Carnage Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"luk","soul":2,"spirit":2,"stats":{"patt":440,"matt":107},"icon":"./assets/ui/items/legacy/shmot/Carnage%20Bow.png"},"soul bow":{"name":"Soul Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"luk","soul":2,"spirit":2,"stats":{"patt":528,"matt":125},"icon":"./assets/ui/items/legacy/shmot/Soul%20Bow.png"},"the bow":{"name":"The Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":519,"matt":121},"icon":"./assets/ui/items/legacy/shmot/The%20Bow.png"},"shining bow":{"name":"Shining Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":58800000,"level":76,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":581,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Shining%20Bow.png"},"infinity bow":{"name":"Infinity Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":68800000,"level":76,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":614,"matt":137},"icon":"./assets/ui/items/legacy/shmot/Infinity%20Bow.png"},"draconic bow":{"name":"Draconic Bow","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":58800000,"level":76,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":581,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Draconic%20Bow.png"},"shining bow r":{"name":"Shining Bow R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":98000000,"level":91,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":770,"matt":150},"icon":"./assets/ui/items/legacy/shmot/Shining%20Bow%20R.png"},"draconic bow r":{"name":"Draconic Bow R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":122000000,"level":91,"weaponKind":"luk","soul":1,"spirit":1,"stats":{"patt":890,"matt":163},"icon":"./assets/ui/items/legacy/shmot/Draconic%20Bow%20R.png"},"dagger":{"name":"Dagger","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":138,"level":0,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":5,"matt":5},"icon":"./assets/ui/items/legacy/shmot/Dagger.png"},"knife":{"name":"Knife","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":12500,"level":0,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":10,"matt":9},"icon":"./assets/ui/items/legacy/shmot/Knife.png"},"sword breaker":{"name":"Sword Breaker","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":244000,"level":0,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":27,"matt":21},"icon":"./assets/ui/items/legacy/shmot/Sword%20Breaker.png"},"crafted dagger":{"name":"Crafted Dagger","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"kin","soul":2,"spirit":2,"stats":{"patt":35,"matt":26},"icon":"./assets/ui/items/legacy/shmot/Crafted%20Dagger.png"},"assassin knife":{"name":"Assassin Knife","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"kin","soul":2,"spirit":2,"stats":{"patt":35,"matt":26},"icon":"./assets/ui/items/legacy/shmot/Assassin%20Knife.png"},"kukuri":{"name":"Kukuri","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":967000,"level":20,"weaponKind":"kin","soul":2,"spirit":2,"stats":{"patt":56,"matt":39},"icon":"./assets/ui/items/legacy/shmot/Kukuri.png"},"conjurers knife":{"name":"Conjurers Knife","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":967000,"level":20,"weaponKind":"kin","soul":2,"spirit":2,"stats":{"patt":45,"matt":52},"icon":"./assets/ui/items/legacy/shmot/Conjurers%20Knife.png"},"cursed dagger":{"name":"Cursed Dagger","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":94,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Cursed%20Dagger.png"},"stiletto":{"name":"Stiletto","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2870000,"level":40,"weaponKind":"kin","soul":2,"spirit":2,"stats":{"patt":107,"matt":68},"icon":"./assets/ui/items/legacy/shmot/Stiletto.png"},"crystal dagger":{"name":"Crystal Dagger","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":6130000,"level":40,"weaponKind":"kin","soul":2,"spirit":2,"stats":{"patt":136,"matt":83},"icon":"./assets/ui/items/legacy/shmot/Crystal%20Dagger.png"},"kris":{"name":"Kris","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":153,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Kris.png"},"demon dagger":{"name":"Demon Dagger","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":170,"matt":99},"icon":"./assets/ui/items/legacy/shmot/Demon%20Dagger.png"},"hell knife":{"name":"Hell Knife","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":122,"matt":122},"icon":"./assets/ui/items/legacy/shmot/Hell%20Knife.png"},"bloody orchid":{"name":"Bloody Orchid","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":186,"matt":107},"icon":"./assets/ui/items/legacy/shmot/Bloody%20Orchid.png"},"soul separator":{"name":"Soul Separator","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":203,"matt":114},"icon":"./assets/ui/items/legacy/shmot/Soul%20Separator.png"},"angel slayer":{"name":"Angel Slayer","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48000000,"level":76,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":246,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Angel%20Slayer.png"},"infinity stinger":{"name":"Infinity Stinger","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":50000000,"level":76,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":260,"matt":137},"icon":"./assets/ui/items/legacy/shmot/Infinity%20Stinger.png"},"angel slayer r":{"name":"Angel Slayer R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":150000000,"level":91,"weaponKind":"kin","soul":1,"spirit":1,"stats":{"patt":360,"matt":237},"icon":"./assets/ui/items/legacy/shmot/Angel%20Slayer%20R.png"},"sabersaber":{"name":"SaberSaber","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":877000,"level":20,"weaponKind":"sdv","soul":2,"spirit":2,"stats":{"patt":73,"matt":37},"icon":"./assets/ui/items/legacy/shmot/SaberSaber.png"},"saberbastard sword":{"name":"SaberBastard Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1060000,"level":20,"weaponKind":"sdv","soul":2,"spirit":2,"stats":{"patt":83,"matt":41},"icon":"./assets/ui/items/legacy/shmot/SaberBastard%20Sword.png"},"chrono maracas":{"name":"Chrono Maracas","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":100,"level":0,"weaponKind":"sdv","soul":1,"spirit":1,"stats":{"patt":5,"matt":5},"icon":"./assets/ui/items/legacy/shmot/Chrono%20Maracas.png"},"sabersword of revolution":{"name":"SaberSword of Revolution","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1960000,"level":40,"weaponKind":"sdv","soul":2,"spirit":2,"stats":{"patt":118,"matt":56},"icon":"./assets/ui/items/legacy/shmot/SaberSword%20of%20Revolution.png"},"bastard swordelven long sword":{"name":"Bastard SwordElven Long Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2470000,"level":40,"weaponKind":"sdv","soul":2,"spirit":2,"stats":{"patt":136,"matt":63},"icon":"./assets/ui/items/legacy/shmot/Bastard%20SwordElven%20Long%20Sword.png"},"stormbringercaliburs":{"name":"StormbringerCaliburs","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":6980000,"level":52,"weaponKind":"sdv","soul":1,"spirit":1,"stats":{"patt":197,"matt":86},"icon":"./assets/ui/items/legacy/shmot/StormbringerCaliburs.png"},"stormbringersamurai long sword":{"name":"StormbringerSamurai Long sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"sdv","soul":1,"spirit":1,"stats":{"patt":213,"matt":97},"icon":"./assets/ui/items/legacy/shmot/StormbringerSamurai%20Long%20sword.png"},"keshanberkdamascus":{"name":"KeshanberkDamascus","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":24100000,"level":62,"weaponKind":"sdv","soul":1,"spirit":1,"stats":{"patt":275,"matt":112},"icon":"./assets/ui/items/legacy/shmot/KeshanberkDamascus.png"},"tallum blade":{"name":"Tallum Blade","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"sdv","soul":1,"spirit":1,"stats":{"patt":342,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Tallum%20Blade.png"},"infinity wing":{"name":"Infinity Wing","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":148800000,"level":91,"weaponKind":"sdv","soul":1,"spirit":1,"stats":{"patt":455,"matt":201},"icon":"./assets/ui/items/legacy/shmot/Infinity%20Wing.png"},"spiked gloves":{"name":"Spiked Gloves","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":768,"level":0,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":10,"matt":6},"icon":"./assets/ui/items/legacy/shmot/Spiked%20Gloves.png"},"iron gloves":{"name":"Iron Gloves","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":12500,"level":0,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":13,"matt":9},"icon":"./assets/ui/items/legacy/shmot/Iron%20Gloves.png"},"fox claw gloves":{"name":"Fox Claw Gloves","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":54100,"level":0,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":21,"matt":12},"icon":"./assets/ui/items/legacy/shmot/Fox%20Claw%20Gloves.png"},"bagh-nakh":{"name":"Bagh-Nakh","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"kas","soul":2,"spirit":2,"stats":{"patt":49,"matt":26},"icon":"./assets/ui/items/legacy/shmot/Bagh-Nakh.png"},"single-edged jamadhr":{"name":"Single-Edged Jamadhr","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":644000,"level":20,"weaponKind":"kas","soul":2,"spirit":2,"stats":{"patt":62,"matt":32},"icon":"./assets/ui/items/legacy/shmot/Single-Edged%20Jamadhr.png"},"triple-edged jamadhr":{"name":"Triple-Edged Jamadhr","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":967000,"level":20,"weaponKind":"kas","soul":2,"spirit":2,"stats":{"patt":78,"matt":39},"icon":"./assets/ui/items/legacy/shmot/Triple-Edged%20Jamadhr.png"},"bich-hwa":{"name":"Bich-Hwa","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1400000,"level":20,"weaponKind":"kas","soul":2,"spirit":2,"stats":{"patt":96,"matt":47},"icon":"./assets/ui/items/legacy/shmot/Bich-Hwa.png"},"chakram":{"name":"Chakram","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"kas","soul":3,"spirit":3,"stats":{"patt":130,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Chakram.png"},"fisted blade":{"name":"Fisted Blade","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":4300000,"level":40,"weaponKind":"kas","soul":3,"spirit":3,"stats":{"patt":169,"matt":76},"icon":"./assets/ui/items/legacy/shmot/Fisted%20Blade.png"},"great pata":{"name":"Great Pata","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":6130000,"level":40,"weaponKind":"kas","soul":3,"spirit":3,"stats":{"patt":190,"matt":83},"icon":"./assets/ui/items/legacy/shmot/Great%20Pata.png"},"knuckle duster":{"name":"Knuckle Duster","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2870000,"level":40,"weaponKind":"kas","soul":3,"spirit":3,"stats":{"patt":148,"matt":68},"icon":"./assets/ui/items/legacy/shmot/Knuckle%20Duster.png"},"arthro nail":{"name":"Arthro Nail","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":213,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Arthro%20Nail.png"},"bellion cestus":{"name":"Bellion Cestus","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":236,"matt":99},"icon":"./assets/ui/items/legacy/shmot/Bellion%20Cestus.png"},"blood tornado":{"name":"Blood Tornado","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":259,"matt":107},"icon":"./assets/ui/items/legacy/shmot/Blood%20Tornado.png"},"dragon grinder":{"name":"Dragon Grinder","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":282,"matt":114},"icon":"./assets/ui/items/legacy/shmot/Dragon%20Grinder.png"},"demon splinter":{"name":"Demon Splinter","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":342,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Demon%20Splinter.png"},"infinity fang":{"name":"Infinity Fang","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":58800000,"level":76,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":361,"matt":137},"icon":"./assets/ui/items/legacy/shmot/Infinity%20Fang.png"},"demon splinter r":{"name":"Demon Splinter R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":98800000,"level":91,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":420,"matt":155},"icon":"./assets/ui/items/legacy/shmot/Demon%20Splinter%20R.png"},"blood tornado r":{"name":"Blood Tornado R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":128800000,"level":91,"weaponKind":"kas","soul":1,"spirit":1,"stats":{"patt":470,"matt":195},"icon":"./assets/ui/items/legacy/shmot/Blood%20Tornado%20R.png"},"voodoo doll":{"name":"Voodoo Doll","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":244000,"level":0,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":25,"matt":28},"icon":"./assets/ui/items/legacy/shmot/Voodoo%20Doll.png"},"buffalos horn":{"name":"Buffalos Horn","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":768,"level":0,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":6,"matt":8},"icon":"./assets/ui/items/legacy/shmot/Buffalos%20Horn.png"},"tears of eva":{"name":"Tears of Eva","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":136000,"level":0,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":19,"matt":22},"icon":"./assets/ui/items/legacy/shmot/Tears%20of%20Eva.png"},"scroll of wisdom":{"name":"Scroll of Wisdom","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":32,"matt":35},"icon":"./assets/ui/items/legacy/shmot/Scroll%20of%20Wisdom.png"},"branch of life":{"name":"Branch of Life","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":32,"matt":35},"icon":"./assets/ui/items/legacy/shmot/Branch%20of%20Life.png"},"temptation of abyss":{"name":"Temptation of Abyss","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":32,"matt":35},"icon":"./assets/ui/items/legacy/shmot/Temptation%20of%20Abyss.png"},"proof of revenge":{"name":"Proof of Revenge","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":32,"matt":35},"icon":"./assets/ui/items/legacy/shmot/Proof%20of%20Revenge.png"},"divine tome":{"name":"Divine Tome","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":644000,"level":20,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":41,"matt":43},"icon":"./assets/ui/items/legacy/shmot/Divine%20Tome.png"},"tears of fairy":{"name":"Tears of Fairy","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2870000,"level":40,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":98,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Tears%20of%20Fairy.png"},"horn of glory":{"name":"Horn of Glory","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2870000,"level":40,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":98,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Horn%20of%20Glory.png"},"heathens book":{"name":"Heathens Book","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":4300000,"level":40,"weaponKind":"kniga","soul":2,"spirit":2,"stats":{"patt":111,"matt":101},"icon":"./assets/ui/items/legacy/shmot/Heathens%20Book.png"},"soul crystal":{"name":"Soul Crystal","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"kniga","soul":1,"spirit":1,"stats":{"patt":155,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Soul%20Crystal.png"},"blood crystal":{"name":"Blood Crystal","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":52,"weaponKind":"kniga","soul":1,"spirit":1,"stats":{"patt":170,"matt":143},"icon":"./assets/ui/items/legacy/shmot/Blood%20Crystal.png"},"forgotten tome":{"name":"Forgotten Tome","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"kniga","soul":1,"spirit":1,"stats":{"patt":186,"matt":186},"icon":"./assets/ui/items/legacy/shmot/Forgotten%20Tome.png"},"tears of fallen angel":{"name":"Tears of Fallen Angel","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"kniga","soul":1,"spirit":1,"stats":{"patt":286,"matt":286},"icon":"./assets/ui/items/legacy/shmot/Tears%20of%20Fallen%20Angel.png"},"blue crystal skull":{"name":"Blue Crystal Skull","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":105000000,"level":91,"weaponKind":"kniga","soul":2,"spirit":3,"stats":{"patt":301,"matt":402},"icon":"./assets/ui/items/legacy/shmot/Blue%20Crystal%20Skull.png"},"short spear":{"name":"Short Spear","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":136000,"level":0,"weaponKind":"koppik","soul":2,"spirit":3,"stats":{"patt":24,"matt":17},"icon":"./assets/ui/items/legacy/shmot/Short%20Spear.png"},"long spear":{"name":"Long Spear","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":244000,"level":0,"weaponKind":"koppik","soul":2,"spirit":2,"stats":{"patt":31,"matt":21},"icon":"./assets/ui/items/legacy/shmot/Long%20Spear.png"},"winged spear":{"name":"Winged Spear","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1400000,"level":20,"weaponKind":"koppik","soul":3,"spirit":3,"stats":{"patt":79,"matt":41},"icon":"./assets/ui/items/legacy/shmot/Winged%20Spear.png"},"trident":{"name":"Trident","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"koppik","soul":3,"spirit":3,"stats":{"patt":40,"matt":26},"icon":"./assets/ui/items/legacy/shmot/Trident.png"},"bec de corbin":{"name":"Bec de Corbin","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2870000,"level":40,"weaponKind":"koppik","soul":2,"spirit":2,"stats":{"patt":122,"matt":68},"icon":"./assets/ui/items/legacy/shmot/Bec%20de%20Corbin.png"},"poleaxe":{"name":"Poleaxe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":4300000,"level":40,"weaponKind":"koppik","soul":2,"spirit":2,"stats":{"patt":139,"matt":76},"icon":"./assets/ui/items/legacy/shmot/Poleaxe.png"},"scythe":{"name":"Scythe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"koppik","soul":2,"spirit":2,"stats":{"patt":107,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Scythe.png"},"lance":{"name":"Lance","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":194,"matt":99},"icon":"./assets/ui/items/legacy/shmot/Lance.png"},"great axe":{"name":"Great Axe","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":175,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Great%20Axe.png"},"halberd":{"name":"Halberd","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":213,"matt":107},"icon":"./assets/ui/items/legacy/shmot/Halberd.png"},"orcish halberd":{"name":"Orcish Halberd","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":21300000,"level":62,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":219,"matt":109},"icon":"./assets/ui/items/legacy/shmot/Orcish%20Halberd.png"},"tallum glaive":{"name":"Tallum Glaive","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":232,"matt":114},"icon":"./assets/ui/items/legacy/shmot/Tallum%20Glaive.png"},"aurakyria lance":{"name":"Aurakyria Lance","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":269,"matt":128},"icon":"./assets/ui/items/legacy/shmot/Aurakyria%20Lance.png"},"infinity spear":{"name":"Infinity Spear","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":58800000,"level":76,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":297,"matt":137},"icon":"./assets/ui/items/legacy/shmot/Infinity%20Spear.png"},"saint spear":{"name":"Saint Spear","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":111800000,"level":91,"weaponKind":"koppik","soul":1,"spirit":1,"stats":{"patt":367,"matt":221},"icon":"./assets/ui/items/legacy/shmot/Saint%20Spear.png"},"short sword":{"name":"Short Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":768,"level":0,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":8,"matt":6},"icon":"./assets/ui/items/legacy/shmot/Short%20Sword.png"},"long sword":{"name":"Long Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13600,"level":0,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":24,"matt":17},"icon":"./assets/ui/items/legacy/shmot/Long%20Sword.png"},"broadsword":{"name":"Broadsword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":12500,"level":0,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":11,"matt":9},"icon":"./assets/ui/items/legacy/shmot/Broadsword.png"},"gladius":{"name":"Gladius","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":54100,"level":0,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":17,"matt":12},"icon":"./assets/ui/items/legacy/shmot/Gladius.png"},"orcish sword":{"name":"Orcish Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":54100,"level":0,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":17,"matt":12},"icon":"./assets/ui/items/legacy/shmot/Orcish%20Sword.png"},"falchion":{"name":"Falchion","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":244000,"level":0,"weaponKind":"me4","soul":2,"spirit":2,"stats":{"patt":31,"matt":21},"icon":"./assets/ui/items/legacy/shmot/Falchion.png"},"bastard sword":{"name":"Bastard Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":644000,"level":20,"weaponKind":"me4","soul":2,"spirit":2,"stats":{"patt":51,"matt":32},"icon":"./assets/ui/items/legacy/shmot/Bastard%20Sword.png"},"claymore":{"name":"Claymore","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":1800000,"level":20,"weaponKind":"me4","soul":2,"spirit":2,"stats":{"patt":112,"matt":54},"icon":"./assets/ui/items/legacy/shmot/Claymore.png"},"sword of magic":{"name":"Sword of Magic","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":716000,"level":20,"weaponKind":"me4","soul":2,"spirit":2,"stats":{"patt":43,"matt":45},"icon":"./assets/ui/items/legacy/shmot/Sword%20of%20Magic.png"},"flamberge":{"name":"Flamberge","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"me4","soul":2,"spirit":2,"stats":{"patt":130,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Flamberge.png"},"shamshir":{"name":"Shamshir","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"me4","soul":2,"spirit":2,"stats":{"patt":122,"matt":68},"icon":"./assets/ui/items/legacy/shmot/Shamshir.png"},"caliburs":{"name":"Caliburs","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":4300000,"level":40,"weaponKind":"me4","soul":3,"spirit":3,"stats":{"patt":139,"matt":76},"icon":"./assets/ui/items/legacy/shmot/Caliburs.png"},"sword of delusion":{"name":"Sword of Delusion","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":4300000,"level":40,"weaponKind":"me4","soul":3,"spirit":3,"stats":{"patt":139,"matt":76},"icon":"./assets/ui/items/legacy/shmot/Sword%20of%20Delusion.png"},"great sword":{"name":"Great Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":213,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Great%20Sword.png"},"sword of damascus":{"name":"Sword of Damascus","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":13100000,"level":52,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":194,"matt":99},"icon":"./assets/ui/items/legacy/shmot/Sword%20of%20Damascus.png"},"blade of serenity":{"name":"Blade of Serenity","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8690000,"level":52,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":175,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Blade%20of%20Serenity.png"},"mist sword":{"name":"Mist Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8890000,"level":52,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":177,"matt":93},"icon":"./assets/ui/items/legacy/shmot/Mist%20Sword.png"},"tallum blade as":{"name":"Tallum Blade As","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":213,"matt":107},"icon":"./assets/ui/items/legacy/shmot/Tallum%20Blade%20As.png"},"dragon slayer":{"name":"Dragon Slayer","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":27000000,"level":62,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":282,"matt":114},"icon":"./assets/ui/items/legacy/shmot/Dragon%20Slayer.png"},"phantom sword":{"name":"Phantom Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":170,"matt":143},"icon":"./assets/ui/items/legacy/shmot/Phantom%20Sword.png"},"elemental sword":{"name":"Elemental Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":170,"matt":143},"icon":"./assets/ui/items/legacy/shmot/Elemental%20Sword.png"},"forgotten blade":{"name":"Forgotten Blade","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":281,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Forgotten%20Blade.png"},"heavens divider":{"name":"Heavens Divider","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":242,"matt":226},"icon":"./assets/ui/items/legacy/shmot/Heavens%20Divider.png"},"infinity blade":{"name":"Infinity Blade","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":291,"matt":136},"icon":"./assets/ui/items/legacy/shmot/Infinity%20Blade.png"},"forgotten blade r":{"name":"Forgotten Blade R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":99800000,"level":91,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":387,"matt":326},"icon":"./assets/ui/items/legacy/shmot/Forgotten%20Blade%20R.png"},"heavens divider r":{"name":"Heavens Divider R","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":99800000,"level":91,"weaponKind":"me4","soul":1,"spirit":1,"stats":{"patt":350,"matt":350},"icon":"./assets/ui/items/legacy/shmot/Heavens%20Divider%20R.png"},"warriors sword":{"name":"Warriors Sword","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":25500,"level":0,"weaponKind":"rap","soul":1,"spirit":1,"stats":{"patt":12,"matt":10},"icon":"./assets/ui/items/legacy/shmot/Warriors%20Sword.png"},"rapier":{"name":"Rapier","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":409000,"level":20,"weaponKind":"rap","soul":1,"spirit":1,"stats":{"patt":36,"matt":26},"icon":"./assets/ui/items/legacy/shmot/Rapier.png"},"fleuret":{"name":"Fleuret","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":644000,"level":20,"weaponKind":"rap","soul":1,"spirit":1,"stats":{"patt":46,"matt":32},"icon":"./assets/ui/items/legacy/shmot/Fleuret.png"},"soldat estoc":{"name":"Soldat Estoc","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":2290000,"level":40,"weaponKind":"rap","soul":2,"spirit":2,"stats":{"patt":97,"matt":61},"icon":"./assets/ui/items/legacy/shmot/Soldat%20Estoc.png"},"blinzlasher":{"name":"Blinzlasher","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":4290000,"level":40,"weaponKind":"rap","soul":2,"spirit":2,"stats":{"patt":109,"matt":66},"icon":"./assets/ui/items/legacy/shmot/Blinzlasher.png"},"colichemarde":{"name":"Colichemarde","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":8680000,"level":52,"weaponKind":"rap","soul":1,"spirit":1,"stats":{"patt":159,"matt":91},"icon":"./assets/ui/items/legacy/shmot/Colichemarde.png"},"white lightning":{"name":"White Lightning","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":18300000,"level":62,"weaponKind":"rap","soul":1,"spirit":1,"stats":{"patt":193,"matt":107},"icon":"./assets/ui/items/legacy/shmot/White%20Lightning.png"},"laevateinn":{"name":"Laevateinn","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":48800000,"level":76,"weaponKind":"rap","soul":1,"spirit":1,"stats":{"patt":255,"matt":132},"icon":"./assets/ui/items/legacy/shmot/Laevateinn.png"},"dynasty rapier":{"name":"Dynasty Rapier","source":"shop","family":"weapon","category":"wearable","slotLabel":"??????","price":88800000,"level":91,"weaponKind":"rap","soul":1,"spirit":1,"stats":{"patt":362,"matt":241},"icon":"./assets/ui/items/legacy/shmot/Dynasty%20Rapier.png"},"small shield":{"name":"Small Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":638,"level":0,"soul":0,"spirit":0,"stats":{"pdef":56},"icon":"./assets/ui/items/legacy/shmot/Small%20Shield.png"},"leather shield":{"name":"Leather Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":47,"level":0,"soul":0,"spirit":0,"stats":{"pdef":39},"icon":"./assets/ui/items/legacy/shmot/Leather%20Shield.png"},"round shield":{"name":"Round Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":7110,"level":0,"soul":0,"spirit":0,"stats":{"pdef":79},"icon":"./assets/ui/items/legacy/shmot/Round%20Shield.png"},"bronze shield":{"name":"Bronze Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":21900,"level":20,"soul":0,"spirit":0,"stats":{"pdef":101},"icon":"./assets/ui/items/legacy/shmot/Bronze%20Shield.png"},"aspis":{"name":"Aspis","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":35000,"level":20,"soul":0,"spirit":0,"stats":{"pdef":114},"icon":"./assets/ui/items/legacy/shmot/Aspis.png"},"plate shield":{"name":"Plate Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":103000,"level":20,"soul":0,"spirit":0,"stats":{"pdef":154},"icon":"./assets/ui/items/legacy/shmot/Plate%20Shield.png"},"tower shield":{"name":"Tower Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":258000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":190},"icon":"./assets/ui/items/legacy/shmot/Tower%20Shield.png"},"chain shield":{"name":"Chain Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":133000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":166},"icon":"./assets/ui/items/legacy/shmot/Chain%20Shield.png"},"full plate shield":{"name":"Full Plate Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":375000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":203},"icon":"./assets/ui/items/legacy/shmot/Full%20Plate%20Shield.png"},"implosion shield":{"name":"Implosion Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":545000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":216},"icon":"./assets/ui/items/legacy/shmot/Implosion%20Shield.png"},"masterpiece shield":{"name":"Masterpiece Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":845000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":230},"icon":"./assets/ui/items/legacy/shmot/Masterpiece%20Shield.png"},"dark crystal shield":{"name":"Dark Crystal Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":1220000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":243},"icon":"./assets/ui/items/legacy/shmot/Dark%20Crystal%20Shield.png"},"shield of nightmare":{"name":"Shield of Nightmare","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":1850000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":256},"icon":"./assets/ui/items/legacy/shmot/Shield%20of%20Nightmare.png"},"dragon shield":{"name":"Dragon Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":2510000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":287},"icon":"./assets/ui/items/legacy/shmot/Dragon%20Shield.png"},"crusader shield":{"name":"Crusader Shield","source":"shop","family":"shield","category":"wearable","slotLabel":"???","price":4310000,"level":91,"soul":0,"spirit":0,"stats":{"pdef":381},"icon":"./assets/ui/items/legacy/shmot/Crusader%20Shield.png"},"cloth cap":{"name":"Cloth Cap","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":55,"level":0,"soul":0,"spirit":0,"stats":{"pdef":13},"icon":"./assets/ui/items/legacy/shmot/Cloth%20Cap.png"},"leather helmet":{"name":"Leather Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":10200,"level":0,"soul":0,"spirit":0,"stats":{"pdef":23},"icon":"./assets/ui/items/legacy/shmot/Leather%20Helmet.png"},"bone helmet":{"name":"Bone Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":31300,"level":20,"soul":0,"spirit":0,"stats":{"pdef":29},"icon":"./assets/ui/items/legacy/shmot/Bone%20Helmet.png"},"helmet":{"name":"Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":76200,"level":20,"soul":0,"spirit":0,"stats":{"pdef":41},"icon":"./assets/ui/items/legacy/shmot/Helmet.png"},"chain helmet":{"name":"Chain Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":147000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":45},"icon":"./assets/ui/items/legacy/shmot/Chain%20Helmet.png"},"mithril helmet":{"name":"Mithril Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":536000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":58},"icon":"./assets/ui/items/legacy/shmot/Mithril%20Helmet.png"},"shining dragon helmet":{"name":"Shining Dragon Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":1740000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":67},"icon":"./assets/ui/items/legacy/shmot/Shining%20Dragon%20Helmet.png"},"implosion helmet":{"name":"Implosion Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":1210000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":66},"icon":"./assets/ui/items/legacy/shmot/Implosion%20Helmet.png"},"red flame helmet":{"name":"Red Flame Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":2640000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":71},"icon":"./assets/ui/items/legacy/shmot/Red%20Flame%20Helmet.png"},"dragon helmet":{"name":"Dragon Helmet","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":3590000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":77},"icon":"./assets/ui/items/legacy/shmot/Dragon%20Helmet.png"},"the hood":{"name":"The Hood","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":3590000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":77},"icon":"./assets/ui/items/legacy/shmot/The%20Hood.png"},"sealed draconic":{"name":"Sealed Draconic","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":6370000,"level":91,"soul":0,"spirit":0,"stats":{"pdef":89},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Draconic.png"},"sealed imperial":{"name":"Sealed Imperial","source":"shop","family":"head","category":"wearable","slotLabel":"????","price":8370000,"level":91,"soul":0,"spirit":0,"stats":{"pdef":93},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Imperial.png"},"cotton robe":{"name":"Cotton Robe","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":3550,"level":0,"soul":0,"spirit":0,"stats":{"pdef":35},"icon":"./assets/ui/items/legacy/shmot/Cotton%20Robe.png"},"robe of devotion":{"name":"Robe of Devotion","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":29700,"level":0,"soul":0,"spirit":0,"stats":{"pdef":49},"icon":"./assets/ui/items/legacy/shmot/Robe%20of%20Devotion.png"},"salamander skin mail":{"name":"Salamander Skin Mail","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":429000,"level":20,"soul":0,"spirit":0,"stats":{"pdef":136},"icon":"./assets/ui/items/legacy/shmot/Salamander%20Skin%20Mail.png"},"clan oath armor":{"name":"Clan Oath Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":529000,"level":20,"soul":0,"spirit":0,"stats":{"pdef":158},"icon":"./assets/ui/items/legacy/shmot/Clan%20Oath%20Armor.png"},"clan oath aketon":{"name":"Clan Oath Aketon","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":247000,"level":20,"soul":0,"spirit":0,"stats":{"pdef":79},"icon":"./assets/ui/items/legacy/shmot/Clan%20Oath%20Aketon.png"},"composite armor":{"name":"Composite Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":1440000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":224},"icon":"./assets/ui/items/legacy/shmot/Composite%20Armor.png"},"full plate armor":{"name":"Full Plate Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":2090000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":239},"icon":"./assets/ui/items/legacy/shmot/Full%20Plate%20Armor.png"},"drake leather armor":{"name":"Drake Leather Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":1570000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":179},"icon":"./assets/ui/items/legacy/shmot/Drake%20Leather%20Armor.png"},"doom plate armor":{"name":"Doom Plate Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":4710000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":270},"icon":"./assets/ui/items/legacy/shmot/Doom%20Plate%20Armor.png"},"avadon leather armor":{"name":"Avadon Leather Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":5710000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":284},"icon":"./assets/ui/items/legacy/shmot/Avadon%20Leather%20Armor.png"},"avadon robe":{"name":"Avadon Robe","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":8710000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":321},"icon":"./assets/ui/items/legacy/shmot/Avadon%20Robe.png"},"robe of nightmare":{"name":"Robe of Nightmare","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":9710000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":351},"icon":"./assets/ui/items/legacy/shmot/Robe%20of%20Nightmare.png"},"majestic robe":{"name":"Majestic Robe","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":9910000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":359},"icon":"./assets/ui/items/legacy/shmot/Majestic%20Robe.png"},"majestic plate armor":{"name":"Majestic Plate Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":9990000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":361},"icon":"./assets/ui/items/legacy/shmot/Majestic%20Plate%20Armor.png"},"draconic leather armor":{"name":"Draconic Leather Armor","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":10190000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":381},"icon":"./assets/ui/items/legacy/shmot/Draconic%20Leather%20Armor.png"},"major arcana robe":{"name":"Major Arcana Robe","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":10190000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":380},"icon":"./assets/ui/items/legacy/shmot/Major%20Arcana%20Robe.png"},"sealed draconic r":{"name":"Sealed Draconic R","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":22290000,"level":91,"soul":0,"spirit":0,"stats":{"pdef":423},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Draconic%20R.png"},"sealed major r":{"name":"Sealed Major R","source":"shop","family":"body","category":"wearable","slotLabel":"????","price":22290001,"level":91,"soul":0,"spirit":0,"stats":{"pdef":423},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Major%20R.png"},"short gloves":{"name":"Short Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":37,"level":0,"soul":0,"spirit":0,"stats":{"pdef":9},"icon":"./assets/ui/items/legacy/shmot/Short%20Gloves.png"},"leather gloves":{"name":"Leather Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":6770,"level":0,"soul":0,"spirit":0,"stats":{"pdef":15},"icon":"./assets/ui/items/legacy/shmot/Leather%20Gloves.png"},"gauntlets":{"name":"Gauntlets","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":50800,"level":20,"soul":0,"spirit":0,"stats":{"pdef":24},"icon":"./assets/ui/items/legacy/shmot/Gauntlets.png"},"ogre power gauntlets":{"name":"Ogre Power Gauntlets","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":97800,"level":20,"soul":0,"spirit":0,"stats":{"pdef":29},"icon":"./assets/ui/items/legacy/shmot/Ogre%20Power%20Gauntlets.png"},"gauntlets of ghost":{"name":"Gauntlets of Ghost","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":358000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":39},"icon":"./assets/ui/items/legacy/shmot/Gauntlets%20of%20Ghost.png"},"karmian gloves":{"name":"Karmian Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":126000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":32},"icon":"./assets/ui/items/legacy/shmot/Karmian%20Gloves.png"},"gloves of seal":{"name":"Gloves of Seal","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":161000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":34},"icon":"./assets/ui/items/legacy/shmot/Gloves%20of%20Seal.png"},"avadon gloves":{"name":"Avadon Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":519000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":41},"icon":"./assets/ui/items/legacy/shmot/Avadon%20Gloves.png"},"doom gloves":{"name":"Doom Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":804000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":44},"icon":"./assets/ui/items/legacy/shmot/Doom%20Gloves.png"},"dark crystal gloves":{"name":"Dark Crystal Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":1160000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":45},"icon":"./assets/ui/items/legacy/shmot/Dark%20Crystal%20Gloves.png"},"dark legion gloves":{"name":"Dark Legion Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":1760000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":48},"icon":"./assets/ui/items/legacy/shmot/Dark%20Legion%20Gloves.png"},"the gloves":{"name":"The Gloves","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":2390000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":51},"icon":"./assets/ui/items/legacy/shmot/The%20Gloves.png"},"dragon gauntlets":{"name":"Dragon Gauntlets","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":2610000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":52},"icon":"./assets/ui/items/legacy/shmot/Dragon%20Gauntlets.png"},"sealed imperial r":{"name":"Sealed Imperial R","source":"shop","family":"gloves","category":"wearable","slotLabel":"????????","price":3610000,"level":91,"soul":0,"spirit":0,"stats":{"pdef":55},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Imperial%20R.png"},"cloth shoes":{"name":"Cloth Shoes","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":37,"level":0,"soul":0,"spirit":0,"stats":{"pdef":9},"icon":"./assets/ui/items/legacy/shmot/Cloth%20Shoes.png"},"leather sandals":{"name":"Leather Sandals","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":37,"level":0,"soul":0,"spirit":0,"stats":{"pdef":9},"icon":"./assets/ui/items/legacy/shmot/Leather%20Sandals.png"},"low boots":{"name":"Low Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":6770,"level":0,"soul":0,"spirit":0,"stats":{"pdef":15},"icon":"./assets/ui/items/legacy/shmot/Low%20Boots.png"},"leather boots":{"name":"Leather Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":20900,"level":20,"soul":0,"spirit":0,"stats":{"pdef":19},"icon":"./assets/ui/items/legacy/shmot/Leather%20Boots.png"},"iron boots":{"name":"Iron Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":50800,"level":20,"soul":0,"spirit":0,"stats":{"pdef":24},"icon":"./assets/ui/items/legacy/shmot/Iron%20Boots.png"},"blue buckskin boots":{"name":"Blue Buckskin Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":33300,"level":20,"soul":0,"spirit":0,"stats":{"pdef":22},"icon":"./assets/ui/items/legacy/shmot/Blue%20Buckskin%20Boots.png"},"mithril boots":{"name":"Mithril Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":126000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":32},"icon":"./assets/ui/items/legacy/shmot/Mithril%20Boots.png"},"divine boots":{"name":"Divine Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":358000,"level":40,"soul":0,"spirit":0,"stats":{"pdef":39},"icon":"./assets/ui/items/legacy/shmot/Divine%20Boots.png"},"wolf boots":{"name":"Wolf Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":519000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":41},"icon":"./assets/ui/items/legacy/shmot/Wolf%20Boots.png"},"implosion boots":{"name":"Implosion Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":804000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":44},"icon":"./assets/ui/items/legacy/shmot/Implosion%20Boots.png"},"boots of silence":{"name":"Boots of Silence","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":519000,"level":52,"soul":0,"spirit":0,"stats":{"pdef":41},"icon":"./assets/ui/items/legacy/shmot/Boots%20of%20Silence.png"},"dragon boots":{"name":"Dragon Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":1760000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":48},"icon":"./assets/ui/items/legacy/shmot/Dragon%20Boots.png"},"red flame boots":{"name":"Red Flame Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":1160000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":45},"icon":"./assets/ui/items/legacy/shmot/Red%20Flame%20Boots.png"},"majestic boots":{"name":"Majestic Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":1760000,"level":62,"soul":0,"spirit":0,"stats":{"pdef":48},"icon":"./assets/ui/items/legacy/shmot/Majestic%20Boots.png"},"the boots":{"name":"The Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":2390000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":51},"icon":"./assets/ui/items/legacy/shmot/The%20Boots.png"},"imperial crusader boots":{"name":"Imperial Crusader Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":3580000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":55},"icon":"./assets/ui/items/legacy/shmot/Imperial%20Crusader%20Boots.png"},"draconic leather boots":{"name":"Draconic Leather Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":3580000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":55},"icon":"./assets/ui/items/legacy/shmot/Draconic%20Leather%20Boots.png"},"major arcana boots":{"name":"Major Arcana Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":3580000,"level":76,"soul":0,"spirit":0,"stats":{"pdef":55},"icon":"./assets/ui/items/legacy/shmot/Major%20Arcana%20Boots.png"},"sealed imperial crusader boots":{"name":"Sealed Imperial Crusader Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":5580000,"level":91,"soul":0,"spirit":0,"stats":{"pdef":62},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Imperial%20Crusader%20Boots.png"},"sealed major arcana boots":{"name":"Sealed Major Arcana Boots","source":"shop","family":"boots","category":"wearable","slotLabel":"???????","price":9580000,"level":91,"soul":0,"spirit":0,"stats":{"pdef":73},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Major%20Arcana%20Boots.png"},"apprentices earring":{"name":"Apprentices Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":249,"level":0,"soul":0,"spirit":0,"stats":{"mdef":11},"icon":"./assets/ui/items/legacy/shmot/Apprentices%20Earring.png"},"earring of strength":{"name":"Earring of Strength","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":3510,"level":0,"soul":0,"spirit":0,"stats":{"mdef":16},"icon":"./assets/ui/items/legacy/shmot/Earring%20of%20Strength.png"},"red crescent earring":{"name":"Red Crescent Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":26900,"level":20,"soul":0,"spirit":0,"stats":{"mdef":24},"icon":"./assets/ui/items/legacy/shmot/Red%20Crescent%20Earring.png"},"tigers eye earring":{"name":"Tigers Eye Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":64300,"level":20,"soul":0,"spirit":0,"stats":{"mdef":30},"icon":"./assets/ui/items/legacy/shmot/Tigers%20Eye%20Earring.png"},"elven earring":{"name":"Elven Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":121000,"level":20,"soul":0,"spirit":0,"stats":{"mdef":36},"icon":"./assets/ui/items/legacy/shmot/Elven%20Earring.png"},"earring of protection":{"name":"Earring of Protection","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":193000,"level":40,"soul":0,"spirit":0,"stats":{"mdef":42},"icon":"./assets/ui/items/legacy/shmot/Earring%20of%20Protection.png"},"blessed earring":{"name":"Blessed Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":424000,"level":40,"soul":0,"spirit":0,"stats":{"mdef":48},"icon":"./assets/ui/items/legacy/shmot/Blessed%20Earring.png"},"adamantite earring":{"name":"Adamantite Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":606000,"level":52,"soul":0,"spirit":0,"stats":{"mdef":51},"icon":"./assets/ui/items/legacy/shmot/Adamantite%20Earring.png"},"otherworldly earring":{"name":"Otherworldly Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":924000,"level":52,"soul":0,"spirit":0,"stats":{"mdef":54},"icon":"./assets/ui/items/legacy/shmot/Otherworldly%20Earring.png"},"majestic earring":{"name":"Majestic Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":2590000,"level":62,"soul":0,"spirit":0,"stats":{"mdef":63},"icon":"./assets/ui/items/legacy/shmot/Majestic%20Earring.png"},"earring of phantom":{"name":"Earring of Phantom","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":1950000,"level":62,"soul":0,"spirit":0,"stats":{"mdef":60},"icon":"./assets/ui/items/legacy/shmot/Earring%20of%20Phantom.png"},"tateossian earring":{"name":"Tateossian Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":4440000,"level":76,"soul":0,"spirit":0,"stats":{"mdef":71},"icon":"./assets/ui/items/legacy/shmot/Tateossian%20Earring.png"},"zakens earring":{"name":"Zakens Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":4440000,"level":76,"soul":0,"spirit":0,"stats":{"mdef":71},"icon":"./assets/ui/items/legacy/shmot/Zakens%20Earring.png"},"sealed tateossian earring":{"name":"Sealed Tateossian Earring","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":5000000,"level":91,"soul":0,"spirit":0,"stats":{"mdef":79},"icon":"./assets/ui/items/legacy/shmot/Sealed%20Tateossian%20Earring.png"},"earring of antharas":{"name":"Earring of Antharas","source":"shop","family":"earring","category":"wearable","slotLabel":"??????","price":6111244,"level":91,"soul":0,"spirit":0,"stats":{"mdef":83},"icon":"./assets/ui/items/legacy/shmot/Earring%20of%20Antharas.png"},"necklace of magic":{"name":"Necklace of Magic","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":66,"level":0,"soul":0,"spirit":0,"stats":{"mdef":15},"icon":"./assets/ui/items/legacy/shmot/Necklace%20of%20Magic.png"},"necklace of anguish":{"name":"Necklace of Anguish","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":4680,"level":0,"soul":0,"spirit":0,"stats":{"mdef":21},"icon":"./assets/ui/items/legacy/shmot/Necklace%20of%20Anguish.png"},"necklace of wisdom":{"name":"Necklace of Wisdom","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":11900,"level":0,"soul":0,"spirit":0,"stats":{"mdef":25},"icon":"./assets/ui/items/legacy/shmot/Necklace%20of%20Wisdom.png"},"necklace of devotion":{"name":"Necklace of Devotion","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":35900,"level":20,"soul":0,"spirit":0,"stats":{"mdef":32},"icon":"./assets/ui/items/legacy/shmot/Necklace%20of%20Devotion.png"},"necklace of darkness":{"name":"Necklace of Darkness","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":162000,"level":20,"soul":0,"spirit":0,"stats":{"mdef":48},"icon":"./assets/ui/items/legacy/shmot/Necklace%20of%20Darkness.png"},"aquastone necklace":{"name":"Aquastone Necklace","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":207000,"level":40,"soul":0,"spirit":0,"stats":{"mdef":52},"icon":"./assets/ui/items/legacy/shmot/Aquastone%20Necklace.png"},"blessed necklace":{"name":"Blessed Necklace","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":565000,"level":40,"soul":0,"spirit":0,"stats":{"mdef":64},"icon":"./assets/ui/items/legacy/shmot/Blessed%20Necklace.png"},"otherworldly necklace":{"name":"Otherworldly Necklace","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":1230000,"level":52,"soul":0,"spirit":0,"stats":{"mdef":72},"icon":"./assets/ui/items/legacy/shmot/Otherworldly%20Necklace.png"},"necklace of grace":{"name":"Necklace of Grace","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":1000000,"level":52,"soul":0,"spirit":0,"stats":{"mdef":68},"icon":"./assets/ui/items/legacy/shmot/Necklace%20of%20Grace.png"},"majestic necklace":{"name":"Majestic Necklace","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":3450000,"level":62,"soul":0,"spirit":0,"stats":{"mdef":85},"icon":"./assets/ui/items/legacy/shmot/Majestic%20Necklace.png"},"tateossian necklace":{"name":"Tateossian Necklace","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":5920000,"level":76,"soul":0,"spirit":0,"stats":{"mdef":95},"icon":"./assets/ui/items/legacy/shmot/Tateossian%20Necklace.png"},"necklace of valakas":{"name":"Necklace of Valakas","source":"shop","family":"necklace","category":"wearable","slotLabel":"????????","price":5990000,"level":76,"soul":0,"spirit":0,"stats":{"mdef":96},"icon":"./assets/ui/items/legacy/shmot/Necklace%20of%20Valakas.png"},"magic ring":{"name":"Magic Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":33,"level":0,"soul":0,"spirit":0,"stats":{"mdef":7},"icon":"./assets/ui/items/legacy/shmot/Magic%20Ring.png"},"ring of knowledge":{"name":"Ring of Knowledge","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":540,"level":0,"soul":0,"spirit":0,"stats":{"mdef":9},"icon":"./assets/ui/items/legacy/shmot/Ring%20of%20Knowledge.png"},"enchanted ring":{"name":"Enchanted Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":28400,"level":20,"soul":0,"spirit":0,"stats":{"mdef":18},"icon":"./assets/ui/items/legacy/shmot/Enchanted%20Ring.png"},"black pearl ring":{"name":"Black Pearl Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":42800,"level":20,"soul":0,"spirit":0,"stats":{"mdef":20},"icon":"./assets/ui/items/legacy/shmot/Black%20Pearl%20Ring.png"},"elven ring":{"name":"Elven Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":62300,"level":20,"soul":0,"spirit":0,"stats":{"mdef":22},"icon":"./assets/ui/items/legacy/shmot/Elven%20Ring.png"},"aquastone ring":{"name":"Aquastone Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":103000,"level":40,"soul":0,"spirit":0,"stats":{"mdef":26},"icon":"./assets/ui/items/legacy/shmot/Aquastone%20Ring.png"},"ring of ages":{"name":"Ring of Ages","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":196000,"level":40,"soul":0,"spirit":0,"stats":{"mdef":30},"icon":"./assets/ui/items/legacy/shmot/Ring%20of%20Ages.png"},"adamantite ring":{"name":"Adamantite Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":404000,"level":52,"soul":0,"spirit":0,"stats":{"mdef":34},"icon":"./assets/ui/items/legacy/shmot/Adamantite%20Ring.png"},"paradia ring":{"name":"Paradia Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":616000,"level":52,"soul":0,"spirit":0,"stats":{"mdef":36},"icon":"./assets/ui/items/legacy/shmot/Paradia%20Ring.png"},"phoenix ring":{"name":"Phoenix Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":1300000,"level":62,"soul":0,"spirit":0,"stats":{"mdef":40},"icon":"./assets/ui/items/legacy/shmot/Phoenix%20Ring.png"},"cerberus ring":{"name":"Cerberus Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":1300000,"level":62,"soul":0,"spirit":0,"stats":{"mdef":40},"icon":"./assets/ui/items/legacy/shmot/Cerberus%20Ring.png"},"tateossian ring":{"name":"Tateossian Ring","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":2960000,"level":76,"soul":0,"spirit":0,"stats":{"mdef":48},"icon":"./assets/ui/items/legacy/shmot/Tateossian%20Ring.png"},"ring of baium":{"name":"Ring of Baium","source":"shop","family":"ring","category":"wearable","slotLabel":"??????","price":2970000,"level":76,"soul":0,"spirit":0,"stats":{"mdef":48},"icon":"./assets/ui/items/legacy/shmot/Ring%20of%20Baium.png"},"hp-50":{"name":"HP-50","source":"mdrop","category":"consumable","slotLabel":"?????","price":150,"level":0,"dropType":"elexir","effect":"hp","give":"50","stats":{},"icon":"./assets/ui/items/legacy/skr/HP-50.gif"},"mp-50":{"name":"MP-50","source":"mdrop","category":"consumable","slotLabel":"?????","price":150,"level":0,"dropType":"elexir","effect":"mp","give":"50","stats":{},"icon":"./assets/ui/items/legacy/skr/MP-50.gif"},"свиток слабой заточки":{"name":"Свиток слабой заточки","source":"mdrop","category":"consumable","slotLabel":"??????","price":30,"level":0,"dropType":"scroll","effect":"scroll_weapon","give":"1|2","stats":{}},"свиток слабой защиты":{"name":"Свиток слабой защиты","source":"mdrop","category":"consumable","slotLabel":"??????","price":30,"level":0,"dropType":"scroll","effect":"scroll_armor","give":"2","stats":{}},"hp-250":{"name":"HP-250","source":"mdrop","category":"consumable","slotLabel":"?????","price":250,"level":0,"dropType":"elexir","effect":"hp","give":"250","stats":{},"icon":"./assets/ui/items/legacy/skr/HP-250.gif"},"свиток заточки":{"name":"Свиток заточки","source":"mdrop","category":"consumable","slotLabel":"??????","price":60,"level":0,"dropType":"scroll","effect":"scroll_weapon","give":"2|4","stats":{}},"mp-250":{"name":"MP-250","source":"mdrop","category":"consumable","slotLabel":"?????","price":250,"level":0,"dropType":"elexir","effect":"mp","give":"250","stats":{},"icon":"./assets/ui/items/legacy/skr/MP-250.gif"},"animal skin":{"name":"Animal Skin","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Animal%20Skin.gif"},"animal bone":{"name":"Animal Bone","source":"mdrop","category":"resource","slotLabel":"?????????","price":300,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Animal%20Bone.gif"},"adamantite nugget":{"name":"Adamantite Nugget","source":"mdrop","category":"resource","slotLabel":"?????????","price":500,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Adamantite%20Nugget.gif"},"recipe: xxxx":{"name":"Recipe: XXXX","source":"mdrop","category":"general","slotLabel":"???????","price":1200,"level":0,"dropType":"rec","effect":"rec","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Recipe.gif"},"asofe":{"name":"Asofe","source":"mdrop","category":"resource","slotLabel":"?????????","price":600,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Asofe.gif"},"beast bone":{"name":"Beast Bone","source":"mdrop","category":"resource","slotLabel":"?????????","price":900,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Beast%20Bone.gif"},"blue diamond fragment":{"name":"Blue Diamond Fragment","source":"mdrop","category":"resource","slotLabel":"?????????","price":900,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Blue%20Diamond%20Fragment.gif"},"blue diamond necklace gem":{"name":"Blue Diamond Necklace Gem","source":"mdrop","category":"resource","slotLabel":"?????????","price":1900,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Blue%20Diamond%20Necklace%20Gem.gif"},"bowstring":{"name":"Bowstring","source":"mdrop","category":"resource","slotLabel":"?????????","price":600,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Bowstring.gif"},"braided hemp":{"name":"Braided Hemp","source":"mdrop","category":"resource","slotLabel":"?????????","price":650,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Braided%20Hemp.gif"},"broadsword mold":{"name":"Broadsword Mold","source":"mdrop","category":"resource","slotLabel":"?????????","price":970,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Broadsword%20Mold.gif"},"cerberus eye fragment":{"name":"Cerberus Eye Fragment","source":"mdrop","category":"resource","slotLabel":"?????????","price":700,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Cerberus%20Eye%20Fragment.gif"},"chain gaiters part":{"name":"Chain Gaiters Part","source":"mdrop","category":"resource","slotLabel":"?????????","price":150,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Chain%20Gaiters%20Part.gif"},"chain mail shirt material":{"name":"Chain Mail Shirt Material","source":"mdrop","category":"resource","slotLabel":"?????????","price":780,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Chain%20Mail%20Shirt%20Material.gif"},"charcoal":{"name":"Charcoal","source":"mdrop","category":"resource","slotLabel":"?????????","price":310,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Charcoal.gif"},"claw of leopard":{"name":"Claw of Leopard","source":"mdrop","category":"resource","slotLabel":"?????????","price":310,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Claw%20of%20Leopard.gif"},"coal":{"name":"Coal","source":"mdrop","category":"resource","slotLabel":"?????????","price":200,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Coal.gif"},"coarse bone powder":{"name":"Coarse Bone Powder","source":"mdrop","category":"resource","slotLabel":"?????????","price":200,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Coarse%20Bone%20Powder.gif"},"cobendell medicine":{"name":"Cobendell Medicine","source":"mdrop","category":"resource","slotLabel":"?????????","price":840,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Cobendell%20Medicine.gif"},"cokes":{"name":"Cokes","source":"mdrop","category":"resource","slotLabel":"?????????","price":470,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Cokes.gif"},"compound braid":{"name":"Compound Braid","source":"mdrop","category":"resource","slotLabel":"?????????","price":470,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Compound%20Braid.gif"},"cradle of creation":{"name":"Cradle of Creation","source":"mdrop","category":"resource","slotLabel":"?????????","price":145,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Cradle%20of%20Creation.gif"},"crafted leather gloves lining":{"name":"Crafted Leather Gloves Lining","source":"mdrop","category":"resource","slotLabel":"?????????","price":1450,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Crafted%20Leather%20Gloves%20Lining.gif"},"crafted leather gloves texture":{"name":"Crafted Leather Gloves Texture","source":"mdrop","category":"resource","slotLabel":"?????????","price":1450,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Crafted%20Leather%20Gloves%20Texture.gif"},"crafted leather":{"name":"Crafted Leather","source":"mdrop","category":"resource","slotLabel":"?????????","price":1005,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Crafted%20Leather.gif"},"craftedwillowbranch":{"name":"CraftedWillowBranch","source":"mdrop","category":"resource","slotLabel":"?????????","price":1100,"level":0,"dropType":"res","effect":"res","give":"0","stats":{}},"crimson boot fabric":{"name":"Crimson Boot Fabric","source":"mdrop","category":"resource","slotLabel":"?????????","price":1100,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Crimson%20Boot%20Fabric.gif"},"cursed bone":{"name":"Cursed Bone","source":"mdrop","category":"resource","slotLabel":"?????????","price":110,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Cursed%20Bone.gif"},"dark forest leaf":{"name":"Dark Forest Leaf","source":"mdrop","category":"resource","slotLabel":"?????????","price":1101,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Dark%20Forest%20Leaf.gif"},"dark stockings material":{"name":"Dark Stockings Material","source":"mdrop","category":"resource","slotLabel":"?????????","price":1101,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Dark%20Stockings%20Material.gif"},"diamond":{"name":"Diamond","source":"mdrop","category":"resource","slotLabel":"?????????","price":111,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Diamond.gif"},"dirk mold":{"name":"Dirk Mold","source":"mdrop","category":"resource","slotLabel":"?????????","price":223,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Dirk%20Mold.gif"},"earring of protection gemstone":{"name":"Earring of Protection Gemstone","source":"mdrop","category":"resource","slotLabel":"?????????","price":2230,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Earring%20of%20Protection%20Gemstone.gif"},"elf stone":{"name":"Elf Stone","source":"mdrop","category":"resource","slotLabel":"?????????","price":1700,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Elf%20Stone.gif"},"elfskin":{"name":"ElfSkin","source":"mdrop","category":"resource","slotLabel":"?????????","price":1700,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/ElfSkin.gif"},"elfsword":{"name":"ElfSword","source":"mdrop","category":"resource","slotLabel":"?????????","price":1700,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/ElfSword.gif"},"elven earring beads":{"name":"Elven Earring Beads","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Elven%20Earring%20Beads.gif"},"elven ring piece":{"name":"Elven Ring Piece","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Elven%20Ring%20Piece.gif"},"enria":{"name":"Enria","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Enria.gif"},"fairy antennae piece":{"name":"Fairy Antennae Piece","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Fairy%20Antennae%20Piece.gif"},"feathered hat fabric":{"name":"Feathered Hat Fabric","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Feathered%20Hat%20Fabric.gif"},"flower":{"name":"Flower","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Flower.gif"},"fungus juice":{"name":"Fungus Juice","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Fungus%20Juice.gif"},"gastraphetes addendum":{"name":"Gastraphetes Addendum","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Gastraphetes%20Addendum.gif"},"hard leather gaiter material":{"name":"Hard Leather Gaiter Material","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Hard%20Leather%20Gaiter%20Material.gif"},"hard leather shirt material":{"name":"Hard Leather Shirt Material","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Hard%20Leather%20Shirt%20Material.gif"},"heabor":{"name":"Heabor","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Heabor.gif"},"hot oil":{"name":"Hot Oil","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Hot%20Oil.gif"},"icarus sawsword piece":{"name":"Icarus Sawsword Piece","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Icarus%20Sawsword%20Piece.gif"},"icarus spirit piece":{"name":"Icarus Spirit Piece","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Icarus%20Spirit%20Piece.gif"},"leonard":{"name":"Leonard","source":"mdrop","category":"resource","slotLabel":"?????????","price":1000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Leonard.gif"},"festival adena":{"name":"Festival Adena","source":"mdrop","category":"resource","slotLabel":"?????????","price":20000,"level":0,"dropType":"res","effect":"res","give":"0","stats":{},"icon":"./assets/ui/items/legacy/skr/Festival%20Adena.gif"},"щит гоблинов":{"name":"Щит гоблинов","source":"mshems","family":"shield","category":"wearable","slotLabel":"???","price":250,"level":3,"classLock":"not","stats":{"pdef":24}},"доспех быка":{"name":"Доспех Быка","source":"mshems","family":"body","category":"wearable","slotLabel":"????","price":300,"level":12,"classLock":"fighert","stats":{"pdef":70,"hp":10}},"сапоги молнии":{"name":"Сапоги Молнии","source":"mshems","family":"boots","category":"wearable","slotLabel":"???????","price":250,"level":7,"classLock":"not","stats":{"pdef":36}},"клинок гоблинов":{"name":"Клинок гоблинов","source":"mshems","family":"weapon","category":"wearable","slotLabel":"??????","price":120,"level":2,"classLock":"not","stats":{"patt":12}},"цеп":{"name":"Цеп","source":"mshems","family":"weapon","category":"wearable","slotLabel":"??????","price":120,"level":3,"classLock":"not","stats":{"patt":16}},"адский клинок":{"name":"Адский клинок","source":"mshems","family":"weapon","category":"wearable","slotLabel":"??????","price":120,"level":4,"classLock":"not","stats":{"patt":23}},"топорик":{"name":"Топорик","source":"mshems","family":"weapon","category":"wearable","slotLabel":"??????","price":9,"level":4,"classLock":"not","stats":{"patt":3}},"??????? ???":{"name":"??????? ???","source":"local","family":"legs","category":"wearable","slotLabel":"???","price":0,"level":0,"stats":{"pdef":16},"icon":"./assets/ui/inventory/pusto/plash.gif"},"?????? ????????":{"name":"?????? ????????","source":"local","category":"quest","slotLabel":"?????","price":0,"level":0,"stats":{}},"????? ???????":{"name":"????? ???????","source":"local","category":"general","slotLabel":"??????","price":0,"level":0,"stats":{}}},"aliases":{"???????? ???":"short sword","???????? ????":"leather helmet","??????? ??????":"cotton robe","??????? ????????":"leather gloves","??????? ???????":"leather sandals","???????? ???????":"necklace of magic","?????? ???????":"apprentices earring","??? ??????????":"small shield"},"meta":{"shopCount":282,"dropCount":59,"craftedCount":7,"supplementalCount":3}};
  const CATALOG = DATA.catalog || {};
  const ALIASES = DATA.aliases || {};

  const LOCAL_ALIASES = {
    'железный меч': 'short sword',
    'железный шлем': 'leather helmet',
    'кожаный доспех': 'cotton robe',
    'кожаные перчатки': 'leather gloves',
    'кожаные ботинки': 'leather sandals',
    'ожерелье ученика': 'necklace of magic',
    'кольцо ученика': 'magic ring',
    'серьга ученика': 'apprentices earring',
    'щит новобранца': 'small shield',
    'hp-50': 'зелье лечения'
  };

  Object.entries(LOCAL_ALIASES).forEach(([alias, target]) => {
    ALIASES[normalizeItemName(alias)] = normalizeItemName(target);
  });

  CATALOG[normalizeItemName('Кожаный низ')] = {
    name: 'Кожаный низ',
    source: 'local',
    family: 'legs',
    category: 'wearable',
    slotLabel: 'Низ',
    price: 0,
    level: 0,
    stats: { pdef: 16 },
    icon: './assets/ui/inventory/pusto/plash.gif'
  };

  CATALOG[normalizeItemName('Печать старосты')] = {
    name: 'Печать старосты',
    source: 'local',
    category: 'quest',
    slotLabel: 'Квест',
    price: 0,
    level: 0,
    stats: {}
  };

  CATALOG[normalizeItemName('Факел путника')] = {
    name: 'Факел путника',
    source: 'local',
    category: 'general',
    slotLabel: 'Сумка',
    price: 0,
    level: 0,
    stats: {}
  };

  CATALOG[normalizeItemName('Зелье лечения')] = {
    name: 'Зелье лечения',
    source: 'local',
    category: 'consumable',
    slotLabel: 'Зелья',
    price: 150,
    level: 0,
    dropType: 'elexir',
    effect: 'hp',
    give: '50',
    stats: {},
    icon: './assets/ui/items/custom/healing_potion.png'
  };

  CATALOG[normalizeItemName('Свиток возврата')] = {
    name: 'Свиток возврата',
    source: 'local',
    category: 'consumable',
    slotLabel: 'Свитки',
    price: 500,
    level: 0,
    dropType: 'scroll',
    effect: 'return_scroll',
    give: 'nearest_city',
    stats: {},
    icon: './assets/ui/items/custom/scroll_return.png'
  };

  const LOCAL_OVERRIDES = {
    '\u0436\u0435\u043b\u0435\u0437\u043d\u044b\u0439 \u043c\u0435\u0447': 'short sword',
    '\u0436\u0435\u043b\u0435\u0437\u043d\u044b\u0439 \u0448\u043b\u0435\u043c': 'leather helmet',
    '\u043a\u043e\u0436\u0430\u043d\u044b\u0439 \u0434\u043e\u0441\u043f\u0435\u0445': 'cotton robe',
    '\u043a\u043e\u0436\u0430\u043d\u044b\u0435 \u043f\u0435\u0440\u0447\u0430\u0442\u043a\u0438': 'leather gloves',
    '\u043a\u043e\u0436\u0430\u043d\u044b\u0435 \u0431\u043e\u0442\u0438\u043d\u043a\u0438': 'leather sandals',
    '\u043e\u0436\u0435\u0440\u0435\u043b\u044c\u0435 \u0443\u0447\u0435\u043d\u0438\u043a\u0430': 'necklace of magic',
    '\u043a\u043e\u043b\u044c\u0446\u043e \u0443\u0447\u0435\u043d\u0438\u043a\u0430': 'magic ring',
    '\u0441\u0435\u0440\u044c\u0433\u0430 \u0443\u0447\u0435\u043d\u0438\u043a\u0430': 'apprentices earring',
    '\u0449\u0438\u0442 \u043d\u043e\u0432\u043e\u0431\u0440\u0430\u043d\u0446\u0430': 'small shield',
    'hp-50': '\u0417\u0435\u043b\u044c\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f'
  };

  Object.entries(LOCAL_OVERRIDES).forEach(([alias, target]) => {
    ALIASES[normalizeItemName(alias)] = normalizeItemName(target);
  });

  CATALOG[normalizeItemName('\u041a\u043e\u0436\u0430\u043d\u044b\u0439 \u043d\u0438\u0437')] = {
    name: '\u041a\u043e\u0436\u0430\u043d\u044b\u0439 \u043d\u0438\u0437',
    source: 'local',
    family: 'legs',
    category: 'wearable',
    slotLabel: '\u041d\u0438\u0437',
    price: 0,
    level: 0,
    stats: { pdef: 16 },
    icon: './assets/ui/inventory/pusto/plash.gif'
  };

  CATALOG[normalizeItemName('\u041f\u0435\u0447\u0430\u0442\u044c \u0441\u0442\u0430\u0440\u043e\u0441\u0442\u044b')] = {
    name: '\u041f\u0435\u0447\u0430\u0442\u044c \u0441\u0442\u0430\u0440\u043e\u0441\u0442\u044b',
    source: 'local',
    category: 'quest',
    slotLabel: '\u041a\u0432\u0435\u0441\u0442',
    price: 0,
    level: 0,
    stats: {}
  };

  CATALOG[normalizeItemName('\u0424\u0430\u043a\u0435\u043b \u043f\u0443\u0442\u043d\u0438\u043a\u0430')] = {
    name: '\u0424\u0430\u043a\u0435\u043b \u043f\u0443\u0442\u043d\u0438\u043a\u0430',
    source: 'local',
    category: 'general',
    slotLabel: '\u0421\u0443\u043c\u043a\u0430',
    price: 0,
    level: 0,
    stats: {}
  };

  CATALOG[normalizeItemName('\u0417\u0435\u043b\u044c\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f')] = {
    name: '\u0417\u0435\u043b\u044c\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f',
    source: 'local',
    category: 'consumable',
    slotLabel: '\u0417\u0435\u043b\u044c\u044f',
    price: 150,
    level: 0,
    dropType: 'elexir',
    effect: 'hp',
    give: '50',
    stats: {},
    icon: './assets/ui/items/custom/healing_potion.png'
  };

  CATALOG[normalizeItemName('\u0421\u0432\u0438\u0442\u043e\u043a \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430')] = {
    name: '\u0421\u0432\u0438\u0442\u043e\u043a \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430',
    source: 'local',
    category: 'consumable',
    slotLabel: '\u0421\u0432\u0438\u0442\u043a\u0438',
    price: 500,
    level: 0,
    dropType: 'scroll',
    effect: 'return_scroll',
    give: 'nearest_city',
    stats: {},
    icon: './assets/ui/items/custom/scroll_return.png'
  };

  const USER_PRESET_ITEMS = new Set(window.HD_USER_PRESET_ITEMS || []);
  function registerPresetItem(name) {
    USER_PRESET_ITEMS.add(name);
    return name;
  }

  const devotionSetKey = 'devotion_set';
  window.HD_SET_LIBRARY = window.HD_SET_LIBRARY || {};
  window.HD_SET_LIBRARY[devotionSetKey] = {
    name: 'Devotion Set',
    thresholds: {
      3: {
        castSpdPct: 15
      }
    },
    notes: {
      3: '+15% Casting Speed'
    }
  };

  const devotionTunic = {
    name: registerPresetItem('Tunic of Devotion'),
    source: 'preset',
    family: 'body',
    category: 'wearable',
    slotLabel: 'Верхняя броня',
    price: 20300,
    weight: 2090,
    level: 0,
    setKey: devotionSetKey,
    setPart: 'body',
    stats: { pdef: 30, mp: 67 },
    icon: './assets/ui/items/presets/devotion/armor_t55_u_i00_0.bmp'
  };

  const devotionStockings = {
    name: registerPresetItem('Stockings of Devotion'),
    source: 'preset',
    family: 'legs',
    category: 'wearable',
    slotLabel: 'Нижняя броня',
    price: 12700,
    weight: 1040,
    level: 0,
    setKey: devotionSetKey,
    setPart: 'legs',
    stats: { pdef: 19, mp: 42 },
    icon: './assets/ui/items/presets/devotion/armor_t55_l_i00_0.bmp'
  };

  const devotionHelmet = {
    name: registerPresetItem('Leather Helmet'),
    source: 'preset',
    family: 'head',
    category: 'wearable',
    slotLabel: 'Шлемы',
    price: 10200,
    weight: 650,
    level: 0,
    setKey: devotionSetKey,
    setPart: 'head',
    stats: { pdef: 23 },
    icon: './assets/ui/items/presets/devotion/armor_leather_helmet_i00_0.bmp'
  };

  CATALOG[normalizeItemName('Tunic of Devotion')] = devotionTunic;
  CATALOG[normalizeItemName('Stockings of Devotion')] = devotionStockings;
  CATALOG[normalizeItemName('Leather Helmet')] = devotionHelmet;
  ALIASES[normalizeItemName('Robe of Devotion')] = normalizeItemName('Tunic of Devotion');
  delete CATALOG[normalizeItemName('Robe of Devotion')];

  const woodenSetKey = 'wooden_set';
  window.HD_SET_LIBRARY[woodenSetKey] = {
    name: 'Wooden Set',
    thresholds: {
      3: {
        pdefPct: 2,
        hp: 41
      }
    },
    notes: {
      3: '+2% P.Def, +41 HP'
    }
  };

  const woodenBreastplate = {
    name: registerPresetItem('Wooden Breastplate'),
    source: 'preset',
    family: 'body',
    category: 'wearable',
    slotLabel: 'Р’РµСЂС…РЅСЏСЏ Р±СЂРѕРЅСЏ',
    price: 7960,
    weight: 4820,
    level: 0,
    setKey: woodenSetKey,
    setPart: 'body',
    stats: { pdef: 47 },
    icon: './assets/ui/items/presets/wooden/armor_t06_u_i00_0.bmp'
  };

  const woodenGaiters = {
    name: registerPresetItem('Wooden Gaiters'),
    source: 'preset',
    family: 'legs',
    category: 'wearable',
    slotLabel: 'РќРёР¶РЅСЏСЏ Р±СЂРѕРЅСЏ',
    price: 4970,
    weight: 1670,
    level: 0,
    setKey: woodenSetKey,
    setPart: 'legs',
    stats: { pdef: 29 },
    icon: './assets/ui/items/presets/wooden/armor_t06_l_i00_0.bmp'
  };

  const woodenHelmet = {
    name: registerPresetItem('Wooden Helmet'),
    source: 'preset',
    family: 'head',
    category: 'wearable',
    slotLabel: 'РЁР»РµРјС‹',
    price: 3980,
    weight: 660,
    level: 0,
    setKey: woodenSetKey,
    setPart: 'head',
    stats: { pdef: 19 },
    icon: './assets/ui/items/presets/wooden/armor_leather_helmet_i00_0.bmp'
  };

  CATALOG[normalizeItemName('Wooden Breastplate')] = woodenBreastplate;
  CATALOG[normalizeItemName('Wooden Gaiters')] = woodenGaiters;
  CATALOG[normalizeItemName('Wooden Helmet')] = woodenHelmet;

  const ngPresetItems = [
    {
      name: registerPresetItem('Leather Shield'),
      source: 'preset',
      family: 'shield',
      category: 'wearable',
      slotLabel: 'Щит',
      grade: 'NG',
      crystals: 0,
      weight: 1430,
      price: 39,
      level: 0,
      stats: { pdef: 47 },
      icon: './assets/ui/items/presets/ng/shield_leather_shield_i00_0.bmp'
    },
    {
      name: registerPresetItem('Small Shield'),
      source: 'preset',
      family: 'shield',
      category: 'wearable',
      slotLabel: 'Щит',
      grade: 'NG',
      crystals: 0,
      weight: 1420,
      price: 638,
      level: 0,
      stats: { pdef: 56 },
      icon: './assets/ui/items/presets/ng/shield_small_shield_i00_0.bmp'
    },
    {
      name: registerPresetItem('Buckler'),
      source: 'preset',
      family: 'shield',
      category: 'wearable',
      slotLabel: 'Щит',
      grade: 'NG',
      crystals: 0,
      weight: 1410,
      price: 2780,
      level: 0,
      stats: { pdef: 67 },
      icon: './assets/ui/items/presets/ng/shield_buckler_i00_0.bmp'
    },
    {
      name: registerPresetItem('Shirt'),
      source: 'preset',
      family: 'body',
      category: 'wearable',
      slotLabel: 'Верхняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 4830,
      price: 147,
      level: 0,
      stats: { pdef: 36 },
      icon: './assets/ui/items/presets/ng/armor_t02_u_i00_0.bmp'
    },
    {
      name: registerPresetItem('Leather Shirt'),
      source: 'preset',
      family: 'body',
      category: 'wearable',
      slotLabel: 'Верхняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 4830,
      price: 2430,
      level: 0,
      stats: { pdef: 43 },
      icon: './assets/ui/items/presets/ng/armor_t04_u_i00_0.bmp'
    },
    {
      name: registerPresetItem('Wooden Breastplate'),
      source: 'preset',
      family: 'body',
      category: 'wearable',
      slotLabel: 'Верхняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 4820,
      price: 7960,
      level: 0,
      setKey: woodenSetKey,
      setPart: 'body',
      stats: { pdef: 47 },
      icon: './assets/ui/items/presets/ng/armor_t06_u_i00_0_1.bmp'
    },
    {
      name: registerPresetItem('Bone Breastplate'),
      source: 'preset',
      family: 'body',
      category: 'wearable',
      slotLabel: 'Верхняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 4770,
      price: 20300,
      level: 0,
      stats: { pdef: 50 },
      icon: './assets/ui/items/presets/ng/armor_t32_u_i00_0.bmp'
    },
    {
      name: registerPresetItem('Piece Bone Breastplate'),
      source: 'preset',
      family: 'body',
      category: 'wearable',
      slotLabel: 'Верхняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 8970,
      price: 31800,
      level: 0,
      stats: { pdef: 62 },
      icon: './assets/ui/items/presets/ng/armor_t33_u_i00_0.bmp'
    },
    {
      name: registerPresetItem('Bronze Breastplate'),
      source: 'preset',
      family: 'body',
      category: 'wearable',
      slotLabel: 'Верхняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 8920,
      price: 49200,
      level: 0,
      stats: { pdef: 68 },
      icon: './assets/ui/items/presets/ng/armor_t34_u_i00_0.bmp'
    },
    {
      name: registerPresetItem('Hard Leather Shirt'),
      source: 'preset',
      family: 'body',
      category: 'wearable',
      slotLabel: 'Верхняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 4720,
      price: 36900,
      level: 0,
      stats: { pdef: 53 },
      icon: './assets/ui/items/presets/ng/armor_t30_u_i00_0.bmp'
    },
    {
      name: registerPresetItem('Pants'),
      source: 'preset',
      family: 'legs',
      category: 'wearable',
      slotLabel: 'Нижняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 1740,
      price: 92,
      level: 0,
      stats: { pdef: 22 },
      icon: './assets/ui/items/presets/ng/armor_t02_l_i00_0.bmp'
    },
    {
      name: registerPresetItem('Leather Pants'),
      source: 'preset',
      family: 'legs',
      category: 'wearable',
      slotLabel: 'Нижняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 1730,
      price: 1520,
      level: 0,
      stats: { pdef: 27 },
      icon: './assets/ui/items/presets/ng/armor_t04_l_i00_0.bmp'
    },
    {
      name: registerPresetItem('Hard Leather Pants'),
      source: 'preset',
      family: 'legs',
      category: 'wearable',
      slotLabel: 'Нижняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 1700,
      price: 4970,
      level: 0,
      stats: { pdef: 29 },
      icon: './assets/ui/items/presets/ng/armor_t06_l_i00_0_1.bmp'
    },
    {
      name: registerPresetItem('Bone Gaiters'),
      source: 'preset',
      family: 'legs',
      category: 'wearable',
      slotLabel: 'Нижняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 1680,
      price: 12700,
      level: 0,
      stats: { pdef: 32 },
      icon: './assets/ui/items/presets/ng/armor_t32_l_i00_0.bmp'
    },
    {
      name: registerPresetItem('Piece Bone Gaiters'),
      source: 'preset',
      family: 'legs',
      category: 'wearable',
      slotLabel: 'Нижняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 4020,
      price: 19900,
      level: 0,
      stats: { pdef: 39 },
      icon: './assets/ui/items/presets/ng/armor_t33_l_i00_0.bmp'
    },
    {
      name: registerPresetItem('Hard Leather Gaiters'),
      source: 'preset',
      family: 'legs',
      category: 'wearable',
      slotLabel: 'Нижняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 1610,
      price: 23000,
      level: 0,
      stats: { pdef: 33 },
      icon: './assets/ui/items/presets/ng/armor_t30_l_i00_0.bmp'
    },
    {
      name: registerPresetItem('Bronze Gaiters'),
      source: 'preset',
      family: 'legs',
      category: 'wearable',
      slotLabel: 'Нижняя броня',
      grade: 'NG',
      crystals: 0,
      weight: 3960,
      price: 30700,
      level: 0,
      stats: { pdef: 43 },
      icon: './assets/ui/items/presets/ng/armor_t34_l_i00_0.bmp'
    },
    {
      name: registerPresetItem('Cloth Shoes'),
      source: 'preset',
      family: 'boots',
      category: 'wearable',
      slotLabel: 'Ботинки',
      grade: 'NG',
      crystals: 0,
      weight: 1320,
      price: 37,
      level: 0,
      stats: { pdef: 9 },
      icon: './assets/ui/items/presets/ng/armor_t02_b_i00_0.bmp'
    },
    {
      name: registerPresetItem('Leather Sandals'),
      source: 'preset',
      family: 'boots',
      category: 'wearable',
      slotLabel: 'Ботинки',
      grade: 'NG',
      crystals: 0,
      weight: 1320,
      price: 37,
      level: 0,
      stats: { pdef: 9 },
      icon: './assets/ui/items/presets/ng/armor_t03_b_i00_0.bmp'
    },
    {
      name: registerPresetItem('Leather Shoes'),
      source: 'preset',
      family: 'boots',
      category: 'wearable',
      slotLabel: 'Ботинки',
      grade: 'NG',
      crystals: 0,
      weight: 1320,
      price: 2650,
      level: 0,
      stats: { pdef: 13 },
      icon: './assets/ui/items/presets/ng/armor_t05_b_i00_0.bmp'
    }
  ];

  ngPresetItems.forEach((item) => {
    CATALOG[normalizeItemName(item.name)] = item;
  });

  function canonicalItemKey(value) {
    const key = normalizeItemName(value);
    return ALIASES[key] || key;
  }

  function resolveItemBlueprint(value) {
    return CATALOG[canonicalItemKey(value)] || null;
  }

  window.HD_ITEM_CATALOG = CATALOG;
  window.HD_ITEM_ALIASES = ALIASES;
  window.HD_ITEM_CATALOG_META = DATA.meta || {};
  window.HD_USER_PRESET_ITEMS = Array.from(USER_PRESET_ITEMS);
  window.HD_NORMALIZE_ITEM_NAME = normalizeItemName;
  window.HD_CANONICAL_ITEM_KEY = canonicalItemKey;
  window.HD_RESOLVE_ITEM_BLUEPRINT = resolveItemBlueprint;
})();
