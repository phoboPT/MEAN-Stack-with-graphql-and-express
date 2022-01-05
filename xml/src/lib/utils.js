import xml2js from "xml2js";

const parser = async (data) => {
  const xml = [];
  for (const item of data.rows) {
    const xmLData = await xml2js.parseStringPromise(item.xml, {
      mergeAttrs: true,
    });
    xml.push(xmLData);
  }
  const parsedXML = { outlet: {}, items: {}, types: {}, outletSize: {} };
  xml.forEach((xmlItem) => {
    xmlItem.File.Outlet.forEach((outlet) => {
      outlet.Outlet.forEach((outletItem) => {
        if (!parsedXML.outlet[outletItem.id[0]]) {
          const newOutlet = {
            name: outletItem.name[0],
            id: outletItem.id[0],
          };
          parsedXML.outlet[outletItem.id[0]] = newOutlet;
        }
      });
    });

    xmlItem.File.Items.forEach((item) => {
      item.Item.forEach((itemItem) => {
        if (!parsedXML.items[itemItem.id[0]]) {
          const newItem = {
            name: itemItem.name[0],
            id: itemItem.id[0],
          };
          parsedXML.items[itemItem.id[0]] = newItem;
        }
      });
    });

    xmlItem.File.Types.forEach((type) => {
      type.Type.forEach((typeItem) => {
        if (!parsedXML.types[typeItem.id[0]]) {
          const newType = {
            name: typeItem.name[0],
            id: typeItem.id[0],
          };
          parsedXML.types[typeItem.id[0]] = newType;
        }
      });
    });

    xmlItem.File.OutletSizes.forEach((outletSize) => {
      outletSize.OutletSize.forEach((outletSizeItem) => {
        if (!parsedXML.outletSize[outletSizeItem.id[0]]) {
          const newOutletSize = {
            name: outletSizeItem.name[0],
            id: outletSizeItem.id[0],
          };
          parsedXML.outletSize[outletSizeItem.id[0]] = newOutletSize;
        }
      });
    });
  });
  const outlets = {};

  xml.forEach((xmlItem) => {
    xmlItem.File.Products.forEach((item) => {
      item.Item.forEach((item) => {
        const newOutlet = {
          id: parsedXML.outlet[item.outlet_id[0]].id,
          name: parsedXML.outlet[item.outlet_id[0]].name,
          size: parsedXML.outletSize[item.outlet_size_id[0]].name,
          year: item.Outlet_Year[0],
          locationType: item.Outlet_Lotation_Type[0],
          sales: item.Sales[0],
          products: [],
        };
        if (!outlets[newOutlet.id]) {
          outlets[newOutlet.id] = newOutlet;
        }

        const products = {
          id: item.id[0],
          name: parsedXML.items[item.id[0]].name,
          type: parsedXML.types[item.type_id[0]].name,
          weight: item.Item_W[0],
          mrp: item.Item_MRP[0],
        };

        outlets[newOutlet.id].products.push(products);
      });
    });
  });

  return outlets;
};

export { parser };
