import aty, { code, exec, type, activateApp, delay, typeInstant } from 'aty'

const suggestAndWait = (t = 1000) => `
  ${code`49${'control'}`}
  ${delay`${t}`}
`

const select = (i = 1) => {
  const s = `
  ${code`125`}
  ${delay`200`}
  `.repeat(i)
  return s
}

const doSelect = (i) => {
  return `
  ${select(i)}
  ${delay`750`}
  ${code`36`}
  `
}

const typeEscape = ({
  raw: [string],
}) => {
  const res = string.split('')
    .map((l) => {
      return `${type`${l}`}
${code`53`}`
    }).join('\n')
  return res
}

(async () => {
  const a = aty`
${activateApp`Code`}
${typeInstant`async `}
${type`${'\'authenticates known user\'({ '}${10}${20}`}
${code`53`}
${type`${'sta'}`}
${delay`${'2500'}`}
${code`36`}
${type` `}
${code`124${'command'}`}
${type` {\n`}
${type`await start(`}
${delay`${'1000'}`}
${code`53`}
${type`middle`}
${code`53`}
${type`ware)\n`}

${type`\t.`}
${code`53`}
${type`set(`}
${delay`1000`}
${code`53`}
${type`'x-auth', `}
${delay`1000`}
${code`53`}
${type`'secret-token')\n`}

${type`.`}
${code`53`}
${type`get(`}
${delay`1000`}
${code`53`}
${type`'/')\n`}

${type`.`}
${code`53`}
${type`a`}
${code`53`}
${type`ssert(`}
${delay`1000`}
${code`53`}
${type`200, `}
${delay`1000`}
${code`53`}
${type`'Hello, ExampleUser')`}
${code`125`}
${type`,`}
`
  await exec(a)
})()

// ${typeInstant`\t.`}
// ${delay`500`}

// ${type`set(`}
// ${delay`1000`}
// ${type`'x-auth', `}
// ${delay`500`}
// ${type`'secret-token')\n`}

// ${type`.get(`}
// ${delay`1000`}
// ${type`'/')\n`}
// ${delay`100`}

// ${type`.assert(`}
// ${delay`1000`}
// ${type`200, `}
// ${delay`500`}
// ${type`'Hello, ExampleUser')`}
// ${code`125`}
// ${type`,`}