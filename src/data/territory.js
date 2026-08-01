/* THE TERRITORY — map geometry, retained but NOT IN USE.
 *
 * Nothing imports this file. The territory build it was made for was
 * reverted at client direction on 2026-08-01 and /locations went back to
 * the scroll-driven map — see §15. It is kept rather than deleted because
 * the extraction, the projection and the nine verified city positions are
 * the part of that build worth keeping: whatever draws this territory next
 * should start here instead of doing it again. Licence and provenance in
 * docs/asset-licenses.md.
 *
 * GEOMETRY PROVENANCE. The brief asked for the Simplemaps India SVG; this
 * environment's network policy refuses simplemaps.com (the proxy answers
 * 403 to CONNECT), so the geometry comes from `datamaps` instead — MIT,
 * and its admin-1 boundaries derive from Natural Earth, which is public
 * domain. Recorded in docs/asset-licenses.md with both facts. A CC-BY-4.0
 * package was available and passed over: attribution-required geometry on
 * a commercial site is a licence to honour in the page, not in a repo doc.
 *
 * The two states were pulled out of the TOPOLOGY and projected here rather
 * than lifted as finished SVG paths, which is what makes the city dots
 * exact: the states and the coordinates go through one geoMercator, so
 * there is no projection to reverse-engineer and no calibration to eyeball.
 * Simplified on the topology (topojson-simplify, quantile 0.2 — 61KB of
 * path data down to 12KB) so the arcs MP and MH share stay shared and the
 * border cannot open a seam.
 *
 * Verified: all nine cities land inside the correct state polygon by
 * point-in-polygon (d3.geoContains) — Nagpur in Maharashtra, the other
 * eight in Madhya Pradesh.
 *
 * Regenerating: the extraction script is not kept in the repo because it
 * is a one-off with two dev-only dependencies. It read `datamaps`'
 * dist/datamaps.ind.js, filtered geometries to IN.MP and IN.MH, ran
 * presimplify/simplify/quantile, fitted a geoMercator into a 1000-wide box
 * with 6% padding, and printed the paths and projected city points below.
 */

export const VIEW_BOX = "0 0 1000 1189";
export const MAP_W = 1000;
export const MAP_H = 1189;
export const GRATICULE = [718.6, 345.1];
export const PATH_MP =
  "M938.7,345.1L936,351.9L927.4,354.9L925.1,360.6L915.5,366.3L892.2,365.5L887.1,363.9L876,363.9L869.9,360.6L863.9,360.1L855.3,364.4L850.2,363.9L841.9,356L836.5,357.6L842.1,374.5L836.3,380.5L834,386.7L838.6,394L847.2,388.3L861.3,391.9L868.7,401.9L873.2,405.2L877.8,404.6L884.4,408.7L885.9,412.2L882.8,425.5L880.6,430.3L875.5,430.1L864.6,435.5L864.1,444.7L857.8,450.6L850.2,454.9L850.7,463.6L849.2,471.1L840.8,476.3L839.1,480.8L829.5,484.6L820.4,491.9L813.8,486.5L803.2,491.6L799.4,487.8L794.1,493.8L793,505.6L784.9,515L784.7,520.1L780.9,528.2L778.4,524.4L774.6,525.2L769.3,535.2L768.8,547.5L764.5,555.5L759.4,559.8L758.6,582.3L755.1,593.5L751,596L737.4,588.7L730.3,588.5L731.8,582.6L725.5,577.5L723.2,572.4L717.7,570.8L712.3,566.8L703.2,573.2L694.4,574L684.3,577.2L677.4,571.1L666.1,572.2L657.7,575.9L655.9,568.7L646.6,562.2L630.4,560.1L628.4,565.5L616.7,569.2L605.4,571.3L602.6,578.6L585.1,582L577.3,581.8L567.7,577.2L560.1,579.1L558.3,568.9L554.3,568.1L550,571.6L541.1,574.3L534,581.2L525.7,585.5L512,589.3L504.7,586.9L497.3,591.1L490.8,589L486.7,590.6L481.7,587.4L479.1,589.8L474.1,579.9L475.1,575.4L486.5,575.4L484.4,561.4L476.4,554.7L465.5,554.2L454.3,560.9L451.1,558.5L439.2,561.7L429.6,568.7L423,569.2L418.7,572.7L417.9,580.4L413.1,587.9L404.8,594.6L406.5,602.9L404.3,606.9L396.9,608L391.9,610.6L387.8,616.2L374.9,619.2L366.3,618.4L359,611.4L362.5,608.2L361.3,600.2L357.2,591.9L353.4,592.2L339.5,589L333.9,590.6L317.5,590.3L309.7,591.7L290.4,590.9L275.5,586.3L269.4,576.4L263.9,572.7L258.3,572.2L251.7,568.9L240.1,569.7L229.5,564.9L222.1,559.6L219.1,549.9L218.9,538.1L210.8,531.1L201.7,538.4L194.6,540.3L188,537.6L189.3,527.4L182.4,513.1L181.7,505.6L183.2,501L189.8,503.2L198.1,498.1L196.1,494.8L186.7,494.8L179.1,488.4L182.4,484.3L190.8,484.9L200.6,476.3L205.4,475.7L209.5,472.2L216.6,457.9L213.8,451.4L208,450.3L204.9,436L209.2,432.8L218.1,433.6L230,429L239.1,423.6L234,418.2L223.4,416L222.1,412.2L226.2,404.9L233,398.9L248.2,392.4L251.7,388.9L258.3,374.7L255,363.6L255.5,354.9L260.8,342.1L255.5,335.5L252.2,322.7L248.2,320.3L241.4,320.8L243.1,311L250.2,303.9L247.7,300.1L239.3,297.6L239.1,293.2L244.9,281.7L243.6,272.4L252.2,282L260.6,279.3L261.3,270.5L249,269.1L248.2,256.5L252.7,257.6L260.6,262.8L272.2,259L271.7,252.1L275,246.1L283.9,246.1L291.4,244.4L288.7,250.5L291.2,256.2L285.1,255.9L289.2,260.6L297,259L296.8,263.1L291.2,265.3L279.3,261.7L281.6,268L278.5,273.8L281.1,276.2L302.3,278.2L319.5,274.9L329.1,271.3L333.9,276.8L334.4,283.4L338.7,288.3L339.3,296.2L336,300.6L329.6,298.1L327.1,303.3L328.1,311.3L333.2,317.3L328.1,327.1L328.6,330.6L333.7,334.7L326.6,345.1L322.6,342.6L317.2,345.6L309.4,341L305.6,346.2L305.9,350.8L313.5,356.8L315.2,362.2L324.1,364.7L327.6,353L330.7,356.3L347.9,349.4L349.9,340.2L360.2,332.3L361,314.5L365.8,311.5L369.9,318.6L374.9,318.1L383,320.5L389.6,320L393.4,325.2L397.9,324.1L401.5,317.5L406.3,315.6L406.5,322.2L416.4,329.8L424.7,328.5L427.3,322.2L420.4,311L420.2,290.8L425.8,291.3L427.8,297.6L431.6,297.6L440.9,293.2L440.7,283.4L432.8,274.6L423.5,272.9L417.7,265.5L424.2,262.8L426.5,257.6L423.2,249.9L424.5,246.6L437.1,241.4L444.2,241.1L453.8,237.5L466.2,239.2L470.3,235.6L471,228.7L467.5,223.2L468.3,218.8L466.2,208.4L458.6,208.4L454.1,216.1L450.8,217.5L443.5,216.1L436.6,219.7L429.8,220.8L421,216.9L417.7,218.3L404.8,212.5L398.4,206.7L395.2,197.3L391.4,181L394.9,177.5L397.2,168.6L406.5,161.4L412.9,162.2L418.9,157.5L420.7,152.3L428.5,144.5L435.9,140.9L437.4,138.1L444.5,135.6L447.5,131.2L454.8,130.7L462.2,124.3L464.5,120.1L473.8,117.9L476.4,113.7L479.9,114.3L490,107.3L498.6,105.1L508.5,98.4L514.8,89.8L524.2,87L530.5,87.6L532,77.3L536.3,78.4L540.6,74.5L545.2,75L547.9,71.4L555.3,71.7L563.1,77.5L572,80.9L583.1,77L588.4,78.1L597.8,86.4L603.3,85.9L607.4,99L612.2,105.9L615,120.4L612.9,124.3L604.6,128.7L605.9,135.6L602.8,140.1L605.9,143.4L599.3,158.4L593.2,169.4L587.1,174.4L586.4,181L588.4,185.5L585.1,190.2L576.5,191.8L570.4,195.1L563.1,194.9L555.3,197.1L551.7,205.6L544.9,212.8L548.9,218.6L554.8,231.2L550.2,251.3L537.8,261.7L542.6,269.7L545.7,279.3L546.7,287.7L542.6,295.7L547.2,302L553.8,307.2L551.7,312.6L555.3,316.4L561.8,312.4L565.6,306.1L579.8,317.3L587.9,318.6L589.2,322.7L594.7,323.3L601.3,312.4L605.9,307.7L607.9,300.6L602.8,299.2L603.1,294.6L598.5,285.5L593.7,283.6L587.1,285.3L585.4,282.8L586.9,276.2L586.6,267.7L583.6,260.6L578.5,253.5L576,237L572.7,229.6L567.9,224.6L568.2,221.3L574.7,210.3L580.3,211.1L586.1,216.9L587.9,209.2L586.1,202.6L590.9,199.8L592.5,209.2L596.5,209.2L597,202.3L602.3,199.8L601.6,207.3L606.4,208.6L604.1,220.8L598.8,225.7L598,231.8L600.3,233.1L608.4,227.4L608.6,223.5L613.7,225.2L610.7,232.3L619.3,231.2L621.3,236.2L624.6,232.6L633.9,234.2L632.4,223.8L636,215L637.5,217.5L634.7,223.2L636,226.3L644.1,223.8L646.6,225.4L639,235.9L639,242.2L643.5,242.8L643.8,237L651.1,240L658.7,232.9L666.8,235.9L676.2,235.1L678.2,237.3L684.5,235.3L682,227.6L688.8,225.2L697.7,218.3L703.7,215.3L706.3,216.6L712.9,210.3L720.9,210.3L724.5,223L730.6,226.3L732.8,232.3L722.7,241.4L719.7,241.4L721.2,248.5L731.6,248.8L731.6,243.9L735.9,248.5L740.9,246.1L735.9,238.9L743,240L746.5,235.9L752.3,243.3L758.4,242.2L753.8,235.9L763.7,234.5L766,229.6L770.8,230.7L767.7,241.7L762.4,249.9L763.7,252.6L773.6,251.6L777.9,254.3L784.2,253.5L791.3,258.7L798.6,254L798.4,247.4L803.7,240L803.9,233.7L809.5,233.4L815,235.9L815.6,239.7L821.4,239.7L823.4,237.3L819.6,234.2L829.2,230.9L832.8,241.9L844.6,244.1L847.9,248L854.8,246.9L858.6,251.8L859.1,257.6L865.6,262.3L872.2,263.4L879.5,268.3L887.1,264.7L887.1,271L892.4,270.5L892.2,276.5L897.5,280.6L896,285L906.1,283.6L906.4,276.8L921,279.8L930.1,276.5L931.9,281.2L935.7,281.4L940,288.6L939.5,291.3L932.9,292.7L932.9,305.2L935.7,308.5L935.4,315.1L932.9,324.9L927.6,327.9L933.2,334.2L932.9,338.8Z";
export const PATH_MH =
  "M755.1,593.5L755.1,598.1L750.5,603.7L738.1,610.6L735.9,614.6L733.8,625L735.6,630.9L743.2,632.2L744.5,635.7L744.5,646.6L746,654.3L739.2,661.5L740.2,664.2L745.7,661.8L750.3,663.6L751.3,671.4L749.5,675.9L750.5,687.8L743.7,693.1L733.6,695.8L732.1,704.3L742.2,706.1L744.5,715.4L742.7,725.2L736.1,724.1L733.6,729.4L737.9,730.5L736.4,734.7L731.8,738.4L736.9,740.3L739.7,736L743.5,736.8L746,743.7L754.8,748.5L756.1,754.8L768.8,760.6L773.6,765.9L773.8,769.1L766,773.6L768.2,778.8L758.6,786.5L755.1,781L749.8,781.2L746.2,774.6L737.9,780.4L731.3,787.5L726.3,803.1L719.7,812.3L720.9,817.8L726,824.1L725.5,827.6L719.2,831.8L719.7,836.8L711.1,838.9L704,838.1L696.4,830.2L689.1,826.2L692.9,822.6L693.1,816.3L690.6,805.7L684.5,806L687.1,797.8L691.4,794.9L690.1,789.4L693.4,773.6L689.3,765.4L684.3,763.5L678.7,755.9L673.4,755.1L663.3,758.8L660.2,763.8L657.2,761.7L644.8,761.2L640,757.2L630.9,755.6L624.6,751.1L615,754L608.6,758L598.8,750.9L596.2,743.2L590.7,739.2L584.9,739.5L576.5,735.5L569.9,734.7L564.6,737.1L559.1,735L555.3,730.2L551,731.3L557.5,746.4L553.5,749.3L550,756.4L549.5,766.2L543.9,768.3L538.1,777L538.8,784.9L536.8,786.5L527.4,786.2L522.1,780.7L515.6,780.2L510.5,789.7L509,798.9L501.6,806.3L503.2,811.8L509.5,816L509.5,818.9L515.6,825.5L509.2,827.8L504.2,837.6L497.6,839.9L498.1,844.9L495.6,849.9L488.7,850.9L485,855.4L483.2,863.8L480.1,867L485,871.1L484.2,873.8L480.7,873L474.6,876.1L473.1,872.5L466.5,869.8L466.2,863L459.4,860.4L456.6,864.3L455.9,873.2L446.8,878.5L444.2,883.7L429.3,886.3L426,907.8L423.7,911.7L414.1,911L415.6,916.7L410.3,921.9L408.6,928.5L402,923L395.2,921.9L389.3,929.8L383.8,934.7L378,936.6L379.2,946.5L377.4,948.3L383,958.2L378.7,960.8L369.1,957.4L344.6,962.9L338.7,954.8L331.4,958.5L327.6,954.8L322.1,954.1L318.3,949.1L311.2,957.2L317.2,972.6L315.7,978.3L319.3,983.2L317.2,987.7L319,992.6L315.7,994.4L311.4,991.1L303.3,996L295.5,993.9L284.4,997.3L284.4,1001.5L276.8,1004.3L269.9,1000.2L268.2,997L260.8,996.5L256.8,1002.5L250.7,1004.6L252,1012.6L246.7,1013.4L236.6,1018.4L232.8,1024.1L234.5,1028.2L225.2,1033.2L222.4,1026.4L214.6,1024.3L212.5,1029.3L207,1033.9L198.4,1033.7L196.3,1038.4L200.1,1038.1L208,1046.7L203.2,1049.5L205.7,1057.6L208.7,1056.3L216.1,1059.9L218.1,1063.3L217.6,1072.8L211.3,1074.9L214.3,1079.1L214,1083.5L207.5,1094.3L209,1098.5L202.4,1106.8L195.3,1107L195.3,1103.9L188.8,1107L185.7,1115L176.1,1117.6L170.3,1113.5L169,1107.8L163.5,1105.5L162.4,1102.4L158.9,1106L151.1,1107.8L146,1105.5L145.7,1099.3L141.2,1091.5L132.8,1083.5L129.1,1076.5L128.5,1064.6L126.8,1063.3L121.5,1049.8L116.9,1031.9L120.2,1035.5L117.2,1024.1L118.4,1021.5L115.4,1016L116.7,1011.1L113.6,1003.8L115.4,993.9L112.4,991.8L114.4,987.7L112.9,978.8L109.1,968.1L106.5,964.7L111.9,966.6L105,957.2L106,949.1L101.7,943.6L102.2,941L107.8,939.4L102.5,938.1L99.5,930L101,926.9L95.9,912.8L91.9,906.2L93.4,902.6L88.6,894.5L87.6,884L84,881.4L85,875.6L88.1,879.5L96.7,881.4L95.2,876.1L88.3,874.8L83.3,869.3L80.7,861.4L83.5,851.2L77.7,839.7L77.5,831.5L84,826.2L88.1,830.7L91.9,827.6L88.3,821.8L85.8,823.4L81.5,820.2L86.3,813.6L93.9,810.7L89.3,810.5L87.6,802L88.1,795.5L84.8,799.9L85.5,805.5L81,811.3L77.5,811.5L74.9,819.4L72.6,811.8L74.9,801.5L73.4,794.7L71.4,795.7L74.4,787.3L70.9,791.8L70.9,783.1L78.7,781.5L89.3,784.9L92.6,791.8L92.9,786.8L89.3,782.8L81.5,782.3L76.2,778.6L73.2,780.2L69.9,775.7L68.3,767.5L80,761.7L72.6,762.2L67.3,757.2L66.3,761.2L65.3,750.9L63.3,744L66.6,745.8L66.8,737.6L62.5,741.9L60,733.1L61.3,723.1L65.1,717.5L65.1,712L71.1,709.3L79.2,709.3L85.8,706.9L90.6,715.1L100,713.8L102.2,716.2L104.8,708L111.3,705.9L112.4,701.4L123.5,701.4L123.7,687.3L121.5,684.6L128.5,673L129.1,664.7L122,659.4L128.3,652.2L131.6,655.9L141.2,661.8L144.2,666L150.8,666.8L159.7,661.8L160.4,656.7L168.8,648.2L168.5,637L165.5,628.5L158.6,620.8L152.1,615.7L145.2,615.2L138.2,609L150.8,610.9L157.6,606.1L160.4,599.7L163.2,601.6L169,599.7L172.3,591.4L181.7,582.9L186.2,584.2L197.9,581L202.2,578.6L201.7,573L193.6,575.6L188.8,573.2L186.2,574.8L176.6,574.6L161.4,579.1L156.4,571.9L156.4,568.1L162.2,565.7L159.2,551.3L160.4,548.3L169.8,545.6L182.2,538.7L188,537.6L194.6,540.3L201.7,538.4L210.8,531.1L218.9,538.1L219.1,549.9L222.1,559.6L229.5,564.9L240.1,569.7L251.7,568.9L258.3,572.2L263.9,572.7L269.4,576.4L275.5,586.3L290.4,590.9L309.7,591.7L317.5,590.3L333.9,590.6L339.5,589L353.4,592.2L357.2,591.9L361.3,600.2L362.5,608.2L359,611.4L366.3,618.4L374.9,619.2L387.8,616.2L391.9,610.6L396.9,608L404.3,606.9L406.5,602.9L404.8,594.6L413.1,587.9L417.9,580.4L418.7,572.7L423,569.2L429.6,568.7L439.2,561.7L451.1,558.5L454.3,560.9L465.5,554.2L476.4,554.7L484.4,561.4L486.5,575.4L475.1,575.4L474.1,579.9L479.1,589.8L481.7,587.4L486.7,590.6L490.8,589L497.3,591.1L504.7,586.9L512,589.3L525.7,585.5L534,581.2L541.1,574.3L550,571.6L554.3,568.1L558.3,568.9L560.1,579.1L567.7,577.2L577.3,581.8L585.1,582L602.6,578.6L605.4,571.3L616.7,569.2L628.4,565.5L630.4,560.1L646.6,562.2L655.9,568.7L657.7,575.9L666.1,572.2L677.4,571.1L684.3,577.2L694.4,574L703.2,573.2L712.3,566.8L717.7,570.8L723.2,572.4L725.5,577.5L731.8,582.6L730.3,588.5L737.4,588.7L751,596Z";
export const PATH_BORDER =
  "M188,537.6L194.6,540.3L201.7,538.4L210.8,531.1L218.9,538.1L219.1,549.9L222.1,559.6L229.5,564.9L240.1,569.7L251.7,568.9L258.3,572.2L263.9,572.7L269.4,576.4L275.5,586.3L290.4,590.9L309.7,591.7L317.5,590.3L333.9,590.6L339.5,589L353.4,592.2L357.2,591.9L361.3,600.2L362.5,608.2L359,611.4L366.3,618.4L374.9,619.2L387.8,616.2L391.9,610.6L396.9,608L404.3,606.9L406.5,602.9L404.8,594.6L413.1,587.9L417.9,580.4L418.7,572.7L423,569.2L429.6,568.7L439.2,561.7L451.1,558.5L454.3,560.9L465.5,554.2L476.4,554.7L484.4,561.4L486.5,575.4L475.1,575.4L474.1,579.9L479.1,589.8L481.7,587.4L486.7,590.6L490.8,589L497.3,591.1L504.7,586.9L512,589.3L525.7,585.5L534,581.2L541.1,574.3L550,571.6L554.3,568.1L558.3,568.9L560.1,579.1L567.7,577.2L577.3,581.8L585.1,582L602.6,578.6L605.4,571.3L616.7,569.2L628.4,565.5L630.4,560.1L646.6,562.2L655.9,568.7L657.7,575.9L666.1,572.2L677.4,571.1L684.3,577.2L694.4,574L703.2,573.2L712.3,566.8L717.7,570.8L723.2,572.4L725.5,577.5L731.8,582.6L730.3,588.5L737.4,588.7L751,596L755.1,593.5";
const XY = {
  nagpur: { x: 617.3, y: 612.7, lat: 21.1458, lon: 79.0882 },
  chhindwara: { x: 604.4, y: 527.8, lat: 22.0574, lon: 78.9382 },
  pandhurna: { x: 568.4, y: 570.8, lat: 21.5967, lon: 78.5222 },
  betul: { x: 514.5, y: 542.4, lat: 21.901, lon: 77.9006 },
  seoni: { x: 656.7, y: 525.1, lat: 22.0869, lon: 79.5432 },
  balaghat: { x: 712.3, y: 550.7, lat: 21.8123, lon: 80.1857 },
  jabalpur: { x: 695.1, y: 422.4, lat: 23.1815, lon: 79.9864 },
  bhopal: { x: 472.3, y: 415, lat: 23.2599, lon: 77.4126 },
  indore: { x: 337.7, y: 465.8, lat: 22.7196, lon: 75.8577 },
};

/* ---------------------------------------------------------------- payloads
 * Deck order. Offices first, then service areas roughly by distance.
 *
 * EVERY DISTANCE IS A ROAD-ROUTE APPROXIMATION SUPPLIED WITH THE BRIEF AND
 * NOT YET VERIFIED — each one carries TODO(client-verify) and the copy says
 * "≈", so nothing on this page claims to be measured. `anchor` is the office
 * the fact names, and it is also the dot the connection line draws from.
 *
 * The body copy for service areas is deliberately identical across all
 * seven: it is a statement of policy, and seven paraphrases of one policy
 * would read as seven different policies.
 */

const AREA_BODY =
  "Site inspections and valuations conducted on location, serviced from our Nagpur and Chhindwara offices.";

/* Label placement is hand-tuned per city, not derived: Chhindwara, Seoni,
   Pandhurna and Betul sit within a few degrees of each other and any
   automatic rule collides at least one pair. `side` puts the label left or
   right of its dot; dy nudges it off the dot's own line. */
export const CITIES = [
  {
    id: "nagpur",
    name: "Nagpur",
    state: "Maharashtra",
    kind: "office",
    fact: "Head office · Maharashtra operations",
    body: "The Nagpur office anchors work across Vidarbha and coordinates inspections into Maharashtra.",
    address:
      "Plot No. 54, Panchtara Society, behind Krishna Super Market 1 (near overbridge), Manish Nagar, Nagpur – 440015",
    map: "https://maps.app.goo.gl/AJYYMS3F3ok3SajR6",
    side: "right",
    dy: 14,
    ...XY.nagpur,
  },
  {
    id: "chhindwara",
    name: "Chhindwara",
    state: "Madhya Pradesh",
    kind: "office",
    fact: "Regional office · Madhya Pradesh operations",
    body: "The Chhindwara office serves the Satpura belt and coordinates inspections across Madhya Pradesh.",
    address:
      "F-02, First Floor, Jail Bagicha Complex, in front of B.S.N.L Office, Parasia Road, Satkar Tiraha, Chhindwara (M.P.) – 480001",
    map: "https://maps.app.goo.gl/dFv8YyStPMFaygpUA",
    side: "left",
    dy: -12,
    ...XY.chhindwara,
  },
  {
    id: "pandhurna",
    name: "Pandhurna",
    state: "Madhya Pradesh",
    kind: "area",
    fact: "≈ 95 km from Chhindwara", // TODO(client-verify)
    anchor: "chhindwara",
    body: AREA_BODY,
    /* below-right. Below-LEFT put the label straight along the MP/MH
       border, and above-right collided with Balaghat once Balaghat moved —
       the two were solved one at a time against each other's old position,
       which is how a fix becomes the next defect. */
    side: "right",
    dy: 22,
    ...XY.pandhurna,
  },
  {
    id: "betul",
    name: "Betul",
    state: "Madhya Pradesh",
    kind: "area",
    fact: "≈ 125 km from Chhindwara", // TODO(client-verify)
    anchor: "chhindwara",
    body: AREA_BODY,
    side: "left",
    dy: 0,
    ...XY.betul,
  },
  {
    id: "seoni",
    name: "Seoni",
    state: "Madhya Pradesh",
    kind: "area",
    fact: "≈ 70 km from Chhindwara", // TODO(client-verify)
    anchor: "chhindwara",
    body: AREA_BODY,
    side: "right",
    dy: -14,
    ...XY.seoni,
  },
  {
    id: "balaghat",
    name: "Balaghat",
    state: "Madhya Pradesh",
    kind: "area",
    fact: "≈ 170 km from Nagpur", // TODO(client-verify)
    anchor: "nagpur",
    body: AREA_BODY,
    /* the eastern outline runs immediately to its right */
    side: "left",
    dy: -2,
    ...XY.balaghat,
  },
  {
    id: "jabalpur",
    name: "Jabalpur",
    state: "Madhya Pradesh",
    kind: "area",
    fact: "≈ 215 km from Chhindwara", // TODO(client-verify)
    anchor: "chhindwara",
    body: AREA_BODY,
    side: "right",
    dy: 0,
    ...XY.jabalpur,
  },
  {
    id: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    kind: "area",
    fact: "≈ 290 km from Chhindwara", // TODO(client-verify)
    anchor: "chhindwara",
    body: AREA_BODY,
    side: "right",
    dy: 0,
    ...XY.bhopal,
  },
  {
    id: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    kind: "area",
    fact: "≈ 430 km from Chhindwara", // TODO(client-verify)
    anchor: "chhindwara",
    body: AREA_BODY,
    side: "left",
    dy: 0,
    ...XY.indore,
  },
];

export const byId = (id) => CITIES.find((c) => c.id === id);

/* City-level maps search for the seven service areas; the two offices carry
   their own pin, which is the same URL the site footer has always used. */
export const mapsUrl = (c) =>
  c.map ||
  `https://www.google.com/maps/search/${encodeURIComponent(`${c.name}, ${c.state}`)}`;

/* The connection line: one quadratic bezier bowing ~8% of the chord, drawn
   perpendicular to it, so a line from an office to a city is never a ruler
   laid across the map. */
export function arc(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = len * 0.08;
  const cx = (from.x + to.x) / 2 - (dy / len) * bow;
  const cy = (from.y + to.y) / 2 + (dx / len) * bow;
  return `M${from.x} ${from.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
}
