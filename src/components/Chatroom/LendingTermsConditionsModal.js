import { Button, Group, Grid } from "@mantine/core";

export default function LendingTermsAndConditions(props) {
  return (
    <>
      <Group position="center">
        <Grid>
          <Grid.Col>
            <b>
              <u>BORROWING TERMS AND CONDITIONS</u>
            </b>
          </Grid.Col>
          <Grid.Col>
            <br />
            <br />
            <ol>
              <li>
                Ensure that you take good care of the item you are borrowing.
              </li>
              <br />
              <li>
                When picking up the item, it is your responsibility to check for
                defects or damage, Neighbourgood recommends taking a picture of
                item together with the lender.
              </li>
              <br />
              <li>A deposit is required for borrowing of any items.</li>
              <br />
              <li>The deposit amount is up to the lender's sole discretion.</li>
              <br />
              <li>
                If you are uncomfortable with the deposit amount, please feel
                free to speak with the lender directly.
              </li>
              <br />
              <li>
                If the item is damaged, the lender has the ability to claim the
                deposit amount.
              </li>
              <br />
              <li>
                Any claims disputes must be sent via email to{" "}
                <a href="https://www.youtube.com/watch?v=eBGIQ7ZuuiU">
                  claims@dartimon.com
                </a>{" "}
                together with photographic proof of the item state.
              </li>
              <br />
              <li>
                Please take note that our headquarters office working hours are
                from 9am - 6pm.
              </li>
              <br />
              <br />
            </ol>
          </Grid.Col>
          <Grid.Col>
            <Button onClick={props.closeModal}>Acknowledge</Button>
          </Grid.Col>
        </Grid>
      </Group>
    </>
  );
}
