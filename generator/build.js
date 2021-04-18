const GeneratorVs = require("./generate-vs.js");
const fs = require("fs").promises;

const BASE_URL = "./pages";
const PAIRS = [
    //[126707, 134072],       //osprey atmos 50 osprey atmos 65
    //[177492, 177493],       //osprey aether 55    osprey aether 65
    //[126705, 126709],       //osprey exos 48  osprey exos 58

    //[126716, 126717],       // osprey aura 50  osprey aura 65
    //[177498, 177499],       // osprey ariel 55 osprey ariel 65
    //[125754, 123205],       // gregory baltoro 65  gregory baltoro 75
    //[164404, 164405],       // osprey poco osprey poco plus
    //[141492, 184890],       // Osprey Women's Kyte 46 Pack Osprey Women's Kyte 56 Pack
    //[126718, 126719],       // Osprey Eja 48 Pack  Osprey Eja 58 Pack
    //[126714, 142360],       // Osprey Lumina 45 Pack   Osprey Lumina 60 Pack
    //[177500, 126715],       // Osprey Women's Ariel Plus 60 Pack   Osprey Women's Ariel Pro 65 Pack
    //[177500, 177571],       // Osprey Women's Ariel Plus 60 Pack   Osprey Women's Ariel Plus 70 Pack
    //[177497, 177496],       // Osprey Men's Aether Plus 85 Pack    Osprey Men's Aether Plus 100 Pack
    //[177495, 126710],       // Osprey Men's Aether Plus 70 Pack    Osprey Men's Aether Pro 70 Pack
    //[126706, 142359],       // Osprey Men's Levity 45 Pack Osprey Men's Levity 60 Pack
    //[141491, 184888],       // Osprey Men's Kestrel 48 Pack    Osprey Men's Kestrel 58 Pack
    //[125528, 127753],       // Deuter Men's Aircontact Lite 50 + 10 Pack   Deuter Men's Aircontact Lite 65 + 10 Pack
    //[167624, 125528],       // Deuter Men's Aircontact Lite 40 + 10 Pack   Deuter Men's Aircontact Lite 50 + 10 Pack
    //[167626, 125529],       // Deuter Women's Aircontact Lite 35 + 10 SL Pack  Deuter Women's Aircontact Lite 45 + 10 SL Pack
    //[125529, 127756],       // Deuter Women's Aircontact Lite 45 + 10 SL Pack  Deuter Women's Aircontact Lite 60 + 10 SL Pack
    //[185550, 126934],       // REI Co-op Men's Traverse 60 Pack    REI Co-op Men's Traverse 70 Pack
    //[148588, 148589],       // REI Co-op Men's Flash 45 Pack   REI Co-op Men's Flash 55 Pack
    //[125757, 123206],       // Gregory Women's Deva 60 Pack    Gregory Women's Deva 70 Pack
    //[123206, 125758],       // Gregory Women's Deva 70 Pack    Gregory Women's Deva 80 Pack
    //[125755, 125756],       // Gregory Men's Baltoro 85 Pack   Gregory Men's Baltoro 95 Pro Pack
    //[159409, 165341],       // Gregory Women's Maven 55 Pack   Gregory Women's Maven 65 Pack
    //[165338, 159409],       // Gregory Women's Maven 45 Pack   Gregory Women's Maven 55 Pack
    //[159408, 165336],       // Gregory Men's Paragon 58 Pack   Gregory Men's Paragon 68 Pack
    //[165334, 159408],       // Gregory Men's Paragon 48 Pack   Gregory Men's Paragon 58 Pack
    //[145638, 145640],       // Gregory Men's Zulu 40 Pack  Gregory Men's Zulu 65 Pack
    //[145651, 145653],       // Gregory Women's Jade 38 Pack    Gregory Women's Jade 63 Pack

    // Product A vs Product B
    [126717, 177499],       //osprey aura 65	osprey ariel 65
    [126716, 177498],       //osprey aura 50	osprey ariel 55
    [177493, 125754],       //osprey aether 65	gregory baltoro 65
    [134072, 125754],       //osprey atmos 65	gregory baltoro 65
    [126709, 126707],       //osprey exos 58	osprey atmos 50
    [177493, 134072],       //osprey aether 65	osprey atmos 65
    [126709, 134072],       //osprey exos 58	osprey atmos 65
    [177495, 123205],       //Osprey Men's Aether Plus 70 Pack	gregory baltoro 75
    [164404, 147418],       //osprey poco	deuter kid comfort active
];

main();

async function main() {

    try {
        for (const pair of PAIRS) {
            const sku1 = pair[0];
            const sku2 = pair[1];

            const html = await GeneratorVs.generate(sku1, sku2);
            const fileName = await getFileName(sku1, sku2);
            await fs.writeFile(fileName, html);

            console.log(`✅ ${fileName}...`);
        }

    } catch (err) {
        console.error("ERR while generating/writing vs.html", err);
    }

}

async function getFileName(sku1, sku2) {
    try {
        const p1 = JSON.parse(
            await fs.readFile(`../data/products/${sku1}.json`, "utf-8")
        );
        const p2 = JSON.parse(
            await fs.readFile(`../data/products/${sku2}.json`, "utf-8")
        );

        const n1 = p1.name.toLowerCase().replace(/ /g, "-");
        const n2 = p2.name.toLowerCase().replace(/ /g, "-");

        return `${BASE_URL}/${n1}-vs-${n2}.html`;
    } catch (err) {
        console.log("ERR:", err);
    }
}
